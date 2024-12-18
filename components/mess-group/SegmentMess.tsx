"use client";
import React, { useEffect, useState } from "react";
import ImageSegment from "./RightMessage/Segment/ImageSegment";
import TextSegment from "./RightMessage/Segment/TextSegment";
import VideoSegment from "./RightMessage/Segment/VideoSegment";
import AudioSegment from "./RightMessage/Segment/AudioSegment";
import OtherSegment from "./RightMessage/Segment/OtherSegment";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ResponseMessageDTO, ResponseReactMessageDTO } from "@/lib/DTO/message";
import { useUserContext } from "@/context/UserContext";
import QuantityReact from "./RightMessage/Segment/QuantityReact";
import { useChatContext } from "@/context/ChatContext";
import { reactMessage } from "@/lib/services/message/react";
import { getPusherClient } from "@/lib/pusher";

interface SegmentMessage {
  segments: ResponseMessageDTO;
  index: number;
  length: number;
}

const SegmentMess: React.FC<SegmentMessage> = ({ segments, index, length }) => {
  const { createBy, contentId, text, id } = segments;
  const { adminInfo } = useUserContext();
  const { setIsReactedByMessage, isReactedByMessage } = useChatContext();
  const adminId = adminInfo._id;
  const isActive = createBy !== adminId;

  // Render Content
  const textSegment = text;
  const contentSegment = contentId && !text;
  const imageSegment = contentSegment && contentId.type === "Image";
  const audioSegment = contentSegment && contentId.type === "Audio";
  const videoSegment = contentSegment && contentId.type === "Video";
  const otherSegment = contentSegment && contentId.type === "Other";

  const [isHovered, setIsHovered] = useState(false);
  const [isReacted, setIsReacted] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [isCount, setIsCount] = useState(segments.isReact.length);

  const handleReact = async () => {
    const reactMap: Record<string, boolean> = { ...isReactedByMessage };
    try {
      const resp = await reactMessage(id);
      if (resp.isReact.length > 0) {
        setIsReacted(true);
        setIsCount(resp.isReact.length);
        reactMap[id] = true;
        setIsReactedByMessage(reactMap);
      } else {
        setIsReacted(false);
        setIsCount(resp.isReact.length);
        reactMap[id] = false;
        setIsReactedByMessage(reactMap);
      }
    } catch (error) {
      console.error("Error reacting to message:", error);
    }
  };

  const handleShowQuantity = () => {
    setShowQuantity(true);
  };

  const showHeart = segments.flag && (isHovered || isReacted);
  const params = {
    setShowQuantity
  };

  useEffect(() => {
    const reactMessage = (data: ResponseReactMessageDTO) => {
      console.log("Successfully received message: ", data);
      const quantity = data.isReact.length;
      if (quantity > 0 && data.id === segments.id) {
        setIsReacted(true);
        setIsCount(quantity);
      } else if (data.id === segments.id) {
        setIsReacted(false);
        setIsCount(0);
      }
    };
    const pusherClient = getPusherClient();
    pusherClient.subscribe(`private-${segments.boxId}`);

    // Bind sự kiện với handler
    pusherClient.bind("react-message", reactMessage);

    //Cleanup khi component bị unmount hoặc boxId thay đổi
    return () => {
      pusherClient.unsubscribe(`private-${segments.boxId}`);
      pusherClient.unbind("react-message");
    };
  }, []);

  useEffect(() => {
    if (segments.isReact.length > 0) {
      setIsReacted(true);
      setIsCount(segments.isReact.length);
    }
  }, []);

  return (
    <>
      <div
        className={`relative flex flex-row items-center justify-start w-fit gap-2 h-full ${
          segments.flag && isReacted ? "pb-5" : ""
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

        {/* Div hiển thị khi đã react */}
        {segments.flag && isReacted && (
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
            segments.flag && isReacted
              ? "bottom-[-2px] right-[6px]"
              : "bottom-[-18px] right-[6px]"
          }`}
          onClick={handleReact}
        >
          <Icon
            icon={
              segments.flag && isReacted ? "mynaui:heart-solid" : "mynaui:heart"
            }
            width={18}
            height={18}
            className={
              segments.flag && isReacted
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
