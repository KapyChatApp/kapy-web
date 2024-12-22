"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import RightTop from "./RightTop";
import RightBottom from "./RightBottom";
import RightMiddle from "./RightMiddle";
import OpenMoreDisplay from "./OpenMoreDisplay";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import { MessageBoxInfo, ResponseMessageDTO } from "@/lib/DTO/message";
import { fetchMessages } from "@/lib/data/message/dataMessages";

interface RightMessageProps {
  chatItem: MessageBoxInfo | undefined;
}

const RightMessage = ({ chatItem }: RightMessageProps) => {
  const pathname = usePathname();
  const [openMore, setOpenMore] = useState(false);
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);

  //FetchMessage Backend
  const { id } = useParams();
  const [message, setMessage] = useState<ResponseMessageDTO[]>();

  const { adminInfo } = useUserContext();
  const adminId = adminInfo._id;

  useEffect(() => {
    const getMessage = async () => {
      try {
        if (id) {
          // Kiểm tra nếu boxId tồn tại
          const boxMessages = await fetchMessages(id.toString());
          setMessage(boxMessages);
        } else {
          console.warn("boxId is undefined");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, []);

  //RightTop
  let top: any;
  if (id && chatItem) {
    top = isGroup
      ? {
          ava: chatItem.groupAva
            ? chatItem.groupAva
            : "/assets/images/icon.png",
          name: chatItem.groupName ? chatItem.groupName : "Group Chat",
          membersGroup: chatItem.memberInfo.length,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore
        }
      : {
          ava:
            chatItem.receiverInfo && chatItem.receiverInfo.avatar
              ? chatItem.receiverInfo.avatar
              : "/assets/ava/default.png",

          name:
            chatItem.receiverInfo &&
            chatItem.receiverInfo.firstName !== "" &&
            chatItem.receiverInfo.lastName !== ""
              ? chatItem.receiverInfo.firstName +
                " " +
                chatItem.receiverInfo.lastName
              : "Unknown name",

          membersGroup: 0,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore
        };
  } else {
    top = isGroup
      ? {
          ava: "/assets/ava/default.png",
          name: "Unknown name",
          membersGroup: 0,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore
        }
      : {
          ava: "/assets/ava/default.png",
          name: "Unknown name",
          membersGroup: 0,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore
        };
  }
  //filterSegment
  const filteredSegmentAdmin = message
    ? message.filter((item) => item.createBy === adminId)
    : [];
  const filteredSegmentOther = message
    ? message.filter((item) => item.createBy !== adminId)
    : [];

  //OpenMoreDisplay
  const display = {
    detailByBox: chatItem,
    openMore,
    setOpenMore
  };
  if (!chatItem) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-row w-full h-full">
      <div
        className={`${
          openMore ? "w-[65%]" : "w-full"
        } background-light900_dark400 rounded-tr-[12px] rounded-br-[12px] pl-[16px] rounded-tl-[12px] rounded-bl-[12px] lg:rounded-tl-[0px] lg:rounded-bl-[0px] md:rounded-tl-[0px] md:rounded-bl-[0px]`}
      >
        <div
          className={`flex flex-col flex-1 w-full py-[16px] lg:px-[12px] pl-0 pr-[12px] justify-between`}
        >
          <RightTop top={top} />

          <RightMiddle
            filteredSegmentAdmin={filteredSegmentAdmin}
            filteredSegmentOther={filteredSegmentOther}
            receiverInfo={chatItem ? chatItem.memberInfo : []}
          />

          <RightBottom
            recipientIds={chatItem.memberInfo.map((item: any) => item.id)}
          />
        </div>
      </div>
      <OpenMoreDisplay display={display} />
    </div>
  );
};

export default RightMessage;
