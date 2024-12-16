"use client";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import { MessageBoxInfo, ResponseMessageDTO } from "@/lib/DTO/message";
import { contentBox, formatTimeMessageBox } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Box {
  box: MessageBoxInfo;
  setClickBox?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickOtherRight?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessageBox: React.FC<Box> = ({ box, setClickBox }) => {
  const { id, receiverInfo, pin, groupName, groupAva, memberInfo } = box;
  const pathname = usePathname();
  const isActive = pathname.includes(id) || pathname === `/chat/${id}`;
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);
  const { messagesByBox, readStatusByBox, dataChat } = useChatContext();
  const { adminInfo, isOnlineChat } = useUserContext();
  const adminId = adminInfo._id;
  const isOnlineGroup = memberInfo.some((member) => isOnlineChat[member._id]);
  const [formattedCreateAt, setFormattedCreateAt] = useState("");

  const contentWithSendername = () => {
    // Tính toán content cho box hiện tại
    let message: ResponseMessageDTO[] = [];
    let content: string = "";
    let senderName: string = "";
    let createAt: string = "";
    if (messagesByBox && messagesByBox[id]) {
      message = messagesByBox[id];
    }
    if (message.length > 0 && message[message.length - 1] && dataChat) {
      const detailByBox = dataChat.find((box) => box.id === id);
      const detail =
        isGroup && detailByBox && detailByBox.receiverInfo
          ? contentBox(
              message[message.length - 1],
              adminId,
              detailByBox.memberInfo
            )
          : contentBox(message[message.length - 1], adminId);
      content = detail.content;
      senderName = detail.senderName;
      createAt = detail.createAt;
    }
    return { content, senderName, createAt };
  };
  const { content, senderName, createAt } = contentWithSendername();
  const handleClickLink = () => {
    if (setClickBox) {
      setClickBox(true); //Click box for responsive
    }
  };

  // Cập nhật createAt mỗi phút
  useEffect(() => {
    // Cập nhật ngay khi render lần đầu
    if (createAt !== "") {
      const updateCreateAt = () => {
        const now = new Date();
        const sendDate = new Date(createAt);
        const timeDifference = now.getTime() - sendDate.getTime();
        const formattedTime =
          timeDifference < 60000 ? "1min" : formatTimeMessageBox(createAt);
        setFormattedCreateAt(formattedTime);
      };
      updateCreateAt();
      const interval = setInterval(() => {
        updateCreateAt();
      }, 60000); // Cập nhật mỗi 1 phút
      return () => clearInterval(interval); // Cleanup interval khi component unmount
    }
  }, [createAt]);

  return (
    <Link
      key=""
      href={isGroup ? `/group-chat/${id}` : `/chat/${id}`}
      className={`${
        isActive
          ? "text-dark100_light900 bg-light-800 dark:bg-dark-200 dark:bg-opacity-40"
          : "text-dark100_light900 bg-transparent hover:bg-light-800 hover:bg-opacity-50 hover:dark:bg-dark-200 hover:dark:bg-opacity-20"
      }  rounded-[20px] hover:rounded-[20px] h-[80px] flex items-center justify-start relative group`}
      onClick={() => {
        handleClickLink();
      }}
    >
      <div className="flex items-center justify-start w-full relative">
        <div className="flex flex-row bg-transparent py-[16px] px-[8px] w-full justify-between items-center relative">
          <div className="flex flex-row bg-transparent lg:gap-[12px] gap-2 min-w-0 items-center pr-1">
            <div className="relative flex-shrink-0 w-fit">
              <Image
                src={isGroup ? groupAva : receiverInfo.avatar}
                alt="ava"
                width={48}
                height={48}
                className="rounded-full lg:w-12 lg:h-12 w-10 h-10"
              />
              {(isGroup ? isOnlineGroup : isOnlineChat[receiverInfo._id]) && (
                <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
              )}
            </div>

            <div className="flex flex-col bg-transparent items-start justify-start gap-[6px] flex-grow overflow-hidden min-w-0">
              <div className="flex items-center justify-start w-full min-w-0">
                <p className="lg:paragraph-15-regular body-regular text-dark100_light900 overflow-hidden text-ellipsis whitespace-nowrap">
                  {isGroup
                    ? groupName
                    : receiverInfo.firstName + " " + receiverInfo.lastName}
                </p>
              </div>
              <div className="flex items-center justify-start w-full min-w-0">
                {readStatusByBox[id] ? (
                  <p className="small-regular justify-start text-dark100_light900 text-ellipsis whitespace-nowrap">
                    {senderName}
                  </p>
                ) : (
                  <p className="small-bold text-dark100_light900 text-ellipsis whitespace-nowrap">
                    {senderName}
                  </p>
                )}
                <div className="flex min-w-0 ">
                  {readStatusByBox[id] ? (
                    <p className="small-custom ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900">{`${content}`}</p>
                  ) : (
                    <p className="small-bold-custom justify-start ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900">{`${content}`}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-transparent items-center justify-end gap-[7px] relative">
            <p className="small-custom">{formattedCreateAt}</p>
            {pin ? (
              <div className="w-full justify-end items-end flex">
                <Icon
                  icon="tabler:pin-filled"
                  width={18}
                  height={18}
                  className="text-dark100_light900"
                />
              </div>
            ) : (
              <div className="w-full justify-end items-end hidden group-hover:flex">
                <Icon
                  icon="tabler:pin"
                  width={18}
                  height={18}
                  className="text-dark100_light900"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MessageBox;
