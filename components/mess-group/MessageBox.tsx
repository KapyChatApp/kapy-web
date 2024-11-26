"use client";
import { MessageBoxContent } from "@/lib/dataBox";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import { MessageBoxProps } from "@/types/mess-group";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Box {
  box: MessageBoxContent;
  setClickBox?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickOtherRight?: React.Dispatch<React.SetStateAction<boolean>>;
  seenStatus: boolean; // Trạng thái đã đọc
  onMarkAsRead: () => void;
  content: string;
  senderName: string;
}

const MessageBox: React.FC<Box> = ({
  box,
  setClickBox,
  setClickOtherRight,
  seenStatus,
  onMarkAsRead,
  content,
  senderName
}) => {
  const { id, receiverInfo, createAt, pin, isOnline, isSeen } = box;
  const pathname = usePathname();
  const isActive = pathname.includes(id) || pathname === `/chat/${id}`;
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);

  const handleClickLink = () => {
    if (setClickBox) {
      setClickBox(true); //Click box for responsive
    }
    if (!seenStatus && isActive) {
      onMarkAsRead(); // Gọi hàm đánh dấu đã đọc
    }
  };

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
                src={receiverInfo.avatar}
                alt="ava"
                width={48}
                height={48}
                className="rounded-full lg:w-12 lg:h-12 w-10 h-10"
              />
              {isOnline && (
                <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
              )}
            </div>

            <div className="flex flex-col bg-transparent items-start justify-start gap-[6px] flex-grow overflow-hidden min-w-0">
              <div className="flex items-center justify-start w-full min-w-0">
                <p className="lg:paragraph-15-regular body-regular text-dark100_light900 overflow-hidden text-ellipsis whitespace-nowrap">
                  {receiverInfo.name}
                </p>
              </div>
              <div className="flex items-center justify-start w-full min-w-0">
                {seenStatus ? (
                  <p className="small-regular justify-start text-dark100_light900 text-ellipsis whitespace-nowrap">
                    {senderName}
                  </p>
                ) : (
                  <p className="small-bold text-dark100_light900 text-ellipsis whitespace-nowrap">
                    {senderName}
                  </p>
                )}
                <div className="flex min-w-0 ">
                  {seenStatus ? (
                    <p className="small-custom ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900">{`${content}`}</p>
                  ) : (
                    <p className="small-bold-custom justify-start ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900">
                      {content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-transparent items-center justify-end gap-[7px] relative">
            <p className="small-custom">{createAt}</p>
            {pin ? (
              <div className="w-full justify-end items-end flex">
                <Icon
                  icon="tabler:pin-filled"
                  width={18}
                  height={18}
                  className="background-light900_dark100 "
                />
              </div>
            ) : (
              <div className="w-full justify-end items-end hidden group-hover:flex">
                <Icon
                  icon="tabler:pin"
                  width={18}
                  height={18}
                  className="background-light900_dark100"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
  // ) : (
  //   <Link
  //     href={`/chat/${id}`}
  //     className={`${
  //       isActive
  //         ? "text-dark100_light900 bg-light-800 dark:bg-dark-200 dark:bg-opacity-40"
  //         : "text-dark100_light900 bg-transparent hover:bg-light-800 hover:bg-opacity-50 hover:dark:bg-dark-200 hover:dark:bg-opacity-20"
  //     }  rounded-[20px] hover:rounded-[20px] h-[80px] flex items-center justify-start relative group`}
  //     onClick={() => {
  //       handleClickLink();
  //     }}
  //   >
  //     <div className="flex items-center justify-start w-full relative">
  //       <div className="flex flex-row bg-transparent py-[16px] px-[8px] w-full justify-between items-center relative">
  //         <div className="flex flex-row bg-transparent lg:gap-[12px] gap-2 min-w-0 items-center pr-1">
  //           <div className="relative flex-shrink-0 w-fit">
  //             <Image
  //               src={ava}
  //               alt="ava"
  //               width={48}
  //               height={48}
  //               className="rounded-full lg:w-12 lg:h-12 w-10 h-10"
  //             />
  //             {isOnline && (
  //               <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
  //             )}
  //           </div>

  //           <div className="flex flex-col bg-transparent items-start justify-start gap-[6px] flex-grow overflow-hidden min-w-0">
  //             <p className="lg:paragraph-regular body-regular  text-dark100_light900">
  //               {otherName}
  //             </p>
  //             <div className="flex items-center w-full min-w-0">
  //               {isClick || isActive ? (
  //                 <p className="small-regular justify-start text-dark100_light900">
  //                   {sender ? `${sender}:` : ""}
  //                 </p>
  //               ) : (
  //                 <p className="small-bold text-dark100_light900">
  //                   {sender ? `${sender}:` : ""}
  //                 </p>
  //               )}
  //               <div className="flex min-w-0 ">
  //                 {isClick || isActive ? (
  //                   <p className="lg:small-custom subtle-regular ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900">{`${content}`}</p>
  //                 ) : (
  //                   <p className="lg:small-bold-custom subtle-bold justify-start ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900">
  //                     {content}
  //                   </p>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex flex-col bg-transparent items-center justify-end gap-[7px] relative">
  //           <p className="small-custom ">{time}</p>
  //           {pin ? (
  //             <div className="w-full justify-end items-end flex">
  //               <Icon
  //                 icon="tabler:pin-filled"
  //                 width={18}
  //                 height={18}
  //                 className="background-light900_dark100 "
  //               />
  //             </div>
  //           ) : (
  //             <div className="w-full justify-end items-end hidden group-hover:flex">
  //               <Icon
  //                 icon="tabler:pin"
  //                 width={18}
  //                 height={18}
  //                 className="background-light900_dark100"
  //               />
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </Link>
  // );
};

export default MessageBox;
