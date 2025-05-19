"use client";
import React, { useEffect, useState } from "react";
import ImageSegment from "./RightMessage/Segment/ImageSegment";
import TextSegment from "./RightMessage/Segment/TextSegment";
import VideoSegment from "./RightMessage/Segment/VideoSegment";
import AudioSegment from "./RightMessage/Segment/AudioSegment";
import OtherSegment from "./RightMessage/Segment/OtherSegment";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  DetailCalling,
  ResponseMessageDTO,
  ResponseReactMessageDTO,
  UserInfoBox
} from "@/lib/DTO/message";
import { useUserContext } from "@/context/UserContext";
import QuantityReact from "./RightMessage/Segment/QuantityReact";
import { useChatContext } from "@/context/ChatContext";
import { reactMessage } from "@/lib/services/message/react";
import { getPusherClient } from "@/lib/pusher";
import { useParams } from "next/navigation";
import CallingSegment from "./RightMessage/Segment/CallingSegment";
import { useSocketContext } from "@/context/SocketContext";
import { useGroupSocketContext } from "@/context/GroupCallContext";
import { SocketGroup } from "@/types/group-call";

interface SegmentMessage {
  segments: ResponseMessageDTO;
  index: number;
  length: number;
  recieverInfo: UserInfoBox[];
}

const SegmentMess: React.FC<SegmentMessage> = ({
  segments,
  index,
  length,
  recieverInfo
}) => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const { createBy, contentId, text, isReact } = segments;
  const { adminInfo } = useUserContext();
  const { setIsReactedByMessage, isReactedByMessage, setMessagesByBox } =
    useChatContext();
  const adminId = adminInfo._id;

  // Render Content
  const textSegment = text && !text.startsWith("__CALL__:");
  const contentSegment = contentId && !text;
  const imageSegment = contentSegment && contentId.type === "Image";
  const audioSegment = contentSegment && contentId.type === "Audio";
  const videoSegment = contentSegment && contentId.type === "Video";
  const otherSegment = contentSegment && contentId.type === "Other";
  const callingSegment = text && text.startsWith("__CALL__:");

  const [isHovered, setIsHovered] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [isCount, setIsCount] = useState(segments.isReact.length);
  const [listReact, setListReact] = useState<string[]>(segments.isReact);
  const handleReact = async () => {
    try {
      const resp = await reactMessage(segments.id);
      if (resp.isReact.length > 0) {
        setIsCount(resp.isReact.length);
        setIsReactedByMessage((prevState) => ({
          ...prevState,
          [segments.id]: true
        }));
        setMessagesByBox((prevMessagesByBox) => {
          const currentMessages = prevMessagesByBox[id] || [];

          const updatedMessages = currentMessages.map((msg) => {
            if (msg.id === segments.id) {
              const isReactSet = new Set(msg.isReact);
              if (!isReactSet.has(adminId)) {
                isReactSet.add(adminId); // Chỉ thêm nếu chưa có
              }

              return {
                ...msg,
                isReact: Array.from(isReactSet) // Chuyển Set thành mảng
              };
            }
            return msg;
          });

          return {
            ...prevMessagesByBox,
            [id]: updatedMessages
          };
        });
      } else {
        setIsCount(resp.isReact.length);
        setIsReactedByMessage((prevState) => ({
          ...prevState,
          [segments.id]: false
        }));
        setMessagesByBox((prevMessagesByBox) => {
          const currentMessages = prevMessagesByBox[id] || [];

          const updatedMessages = currentMessages.map((msg) =>
            msg.id === segments.id
              ? {
                  ...msg,
                  isReact: msg.isReact.filter(
                    (reactedUserId) => reactedUserId !== adminId
                  )
                }
              : msg
          );

          return {
            ...prevMessagesByBox,
            [id]: updatedMessages
          };
        });
      }
    } catch (error) {
      console.error("Error reacting to message:", error);
    }
  };
  const handleShowQuantity = () => {
    setShowQuantity(!showQuantity);
  };

  const showHeart =
    segments.flag &&
    (isHovered || isReactedByMessage[segments.id]) &&
    !callingSegment;
  const params = {
    setShowQuantity,
    recieverInfo,
    isReact: listReact
  };

  useEffect(() => {
    const reactMessage = (data: ResponseReactMessageDTO) => {
      console.log("Successfully received message: ", data);
      const quantity = data.isReact.length;
      if (quantity > 0 && data.id === segments.id) {
        setIsCount(quantity);
        setListReact(data.isReact);
        setIsReactedByMessage((prevState) => ({
          ...prevState,
          [segments.id]: data.isReact.length > 0 ? true : false
        }));
      } else if (data.id === segments.id) {
        setIsCount(0);
        setIsReactedByMessage((prevState) => ({
          ...prevState,
          [segments.id]: data.isReact.length > 0 ? true : false
        }));
      }
    };
    const pusherClient = getPusherClient();
    pusherClient.subscribe(`private-${segments.boxId}`);
    pusherClient.subscribe(`private-${adminInfo._id}`);

    // Bind sự kiện với handler
    pusherClient.bind("react-message", reactMessage);

    //Cleanup khi component bị unmount hoặc boxId thay đổi
    return () => {
      pusherClient.unsubscribe(`private-${segments.boxId}`);
      pusherClient.unsubscribe(`private-${adminInfo._id}`);
      pusherClient.unbind("react-message", reactMessage);
    };
  });

  useEffect(() => {
    if (segments.isReact.length > 0) {
      setIsCount(segments.isReact.length);
    }
  }, []);

  //Calling Event
  const { handleCall, onlineUsers } = useSocketContext();
  const { handleGroupCall, onlineGroupUsers } = useGroupSocketContext();
  const { dataChat } = useChatContext();
  const chatItem = dataChat.find((chat) => chat.id === id);
  const receiverId = recieverInfo.find(
    (item) => item._id !== adminInfo._id
  )?._id;
  const client =
    onlineUsers && onlineUsers.find((user) => user.profile._id === receiverId);
  const membersGroupId =
    Array.isArray(recieverInfo) &&
    recieverInfo
      .map((member) => member._id)
      .filter((item) => item !== adminInfo?._id);
  const clientGroup =
    onlineGroupUsers &&
    onlineGroupUsers.filter(
      (user) => membersGroupId && membersGroupId.includes(user.userId)
    );
  const groupInfo: SocketGroup = {
    _id: id,
    name: chatItem ? chatItem.groupName : "",
    avatar: chatItem ? chatItem.groupAva : "",
    members: recieverInfo
  };
  return (
    <>
      <div
        className={`relative flex flex-row items-center justify-start w-fit gap-2 h-full ${
          segments.flag && isReactedByMessage[segments.id] ? "pb-5" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {textSegment && (
          <TextSegment segments={segments} index={index} length={length} />
        )}
        {imageSegment && (
          <ImageSegment segments={segments} index={index} length={length} />
        )}
        {videoSegment && (
          <VideoSegment segments={segments} index={index} length={length} />
        )}
        {audioSegment && (
          <AudioSegment segments={segments} index={index} length={length} />
        )}
        {otherSegment && (
          <OtherSegment segments={segments} index={index} length={length} />
        )}
        {callingSegment &&
          (() => {
            const call: DetailCalling = JSON.parse(
              text.replace("__CALL__:", "")
            );
            return (
              <CallingSegment
                detail={call}
                client={client}
                clientGroup={clientGroup}
                groupInfo={groupInfo}
              />
            );
          })()}

        {/* Div hiển thị khi đã react */}
        {segments.flag && isReactedByMessage[segments.id] && (
          <div className="absolute bottom-0 right-[40px] ">
            <div
              className="flex flex-row gap-2 background-light700_dark200 rounded-3xl shadow-sm items-center justify-center p-1 h-fit cursor-pointer"
              onClick={handleShowQuantity}
            >
              <Icon
                icon="mynaui:heart-solid"
                width={16}
                height={16}
                className="text-accent-red"
              />
              <span className="small-regular text-dark100_light900">
                {isCount}
              </span>
            </div>
          </div>
        )}

        {/* Icon trái tim */}
        <div
          className={`absolute cursor-pointer transition-transform p-1 rounded-full shadow-sm background-light700_dark200 z-10 ${
            showHeart ? "visible" : "invisible"
          } ${isHovered ? "hover:scale-110" : ""} ${
            segments.flag && isReactedByMessage[segments.id]
              ? "bottom-[-2px] right-[6px]"
              : "bottom-[-18px] right-[6px]"
          }`}
          onClick={handleReact}
        >
          <Icon
            icon={
              segments.flag && isReactedByMessage[segments.id]
                ? "mynaui:heart-solid"
                : "mynaui:heart"
            }
            width={18}
            height={18}
            className={
              segments.flag && isReactedByMessage[segments.id]
                ? "text-accent-red"
                : "text-dark100_light900"
            }
          />
        </div>
      </div>

      {showQuantity && <QuantityReact params={params} />}
    </>
  );
};

export default SegmentMess;
