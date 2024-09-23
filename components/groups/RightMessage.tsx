"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import MessageFriend from "../shared/messAttibute/MessageFriend";
import MessageInput from "../shared/messAttibute/MessageInput";
import ToggleButton from "../shared/button/ToggleButton";
import { dataGroup, group, members } from "@/constants";
import { useParams, usePathname } from "next/navigation";

interface RightMessageProps {
  onToggleChange: (newState: boolean) => void; // Định nghĩa kiểu cho onToggleChange
}

const RightMessage: React.FC<RightMessageProps> = ({ onToggleChange }) => {
  const [childData, setChildData] = useState(false);

  // Hàm callback để nhận dữ liệu từ ToggleButton
  const handleChildData = (data: boolean) => {
    setChildData(!childData); // Cập nhật state nội bộ
    onToggleChange(data); // Gọi hàm callback để gửi state lên component cha
  };

  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const isActive = pathname === "/groups";
  console.log(id);
  const filteredMessages = useMemo(() => {
    return dataGroup.filter((message) => message.groupId === id);
  }, [id]);
  const filteredMembers = filteredMessages.filter((mem) =>
    mem.members.filter((online) => online.isOnline)
  );
  const groupInfo = group.filter((info) => info.id === id);
  console.log(groupInfo);
  const onlineCount = filteredMembers.length;

  return (
    !isActive && (
      <section className="flex bg-transparent w-full">
        <div
          className={`${
            filteredMessages.length > 0
              ? "flex flex-col flex-1 w-full py-[16px] px-[12px] gap-2"
              : "flex flex-col flex-1 w-full py-[16px] px-[12px] justify-between"
          }`}
        >
          <div className="flex flex-row h-[48px] w-full ml-[6px] justify-between items-center">
            <div className="flex flex-row">
              <div className="flex items-center bg-transparent relative">
                <Image
                  src={groupInfo[0].ava}
                  alt="ava"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div
                  className={`${
                    onlineCount > 0 ? "bg-green-600" : "bg-transparent"
                  } rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]`}
                ></div>
              </div>
              <div className="flex flex-col justify-start ml-[8px] gap-[6px]">
                <div className="flex items-center justify-start">
                  <p className="paragraph-regular">{groupInfo[0].name}</p>
                </div>
                <div className="flex items-center justify-start">
                  <p className="small-light">
                    {groupInfo[0].members.length} members, {onlineCount} onlines
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-start justify-center h-full">
              <Button className="flex bg-transparent cursor-pointer py-[12px] px-[8px] shadow-none hover:shadow-none focus:shadow-none outline-none border-none">
                <Icon
                  icon="fluent:video-20-filled"
                  width={24}
                  height={24}
                  className="text-primary-500"
                />
              </Button>

              <Button className="flex bg-transparent cursor-pointer py-[12px] px-[8px] shadow-none hover:shadow-none focus:shadow-none outline-none border-none">
                <Icon
                  icon="ion:call"
                  width={24}
                  height={24}
                  className="text-primary-500"
                />
              </Button>

              <ToggleButton onDataChange={handleChildData} />
            </div>
          </div>

          {!isActive && (
            <div className="flex flex-row w-full h-full scrollable overflow-scroll">
              <div className="flex flex-col w-full h-full mt-[16px]">
                {filteredMessages.length > 0
                  ? filteredMessages.map((item) => (
                      <MessageFriend
                        key={item.id}
                        id={item.id}
                        adminId=""
                        userId=""
                        adminName=""
                        userName={item.createdBy}
                        ava=""
                        content={item.content}
                        createdAt={item.createdAt}
                        isOnline
                      ></MessageFriend>
                    ))
                  : null}
              </div>
            </div>
          )}

          <div className="flex flex-row bg-transparent items-center justify-start w-full">
            <div className="flex flex-row gap-[16px] items-center justify-center">
              <Icon
                icon="carbon:add-filled"
                width={28}
                height={28}
                className="text-primary-500 cursor-pointer"
              />
              <Icon
                icon="basil:picture-solid"
                width={28}
                height={28}
                className="text-primary-500 cursor-pointer"
              />
              <Icon
                icon="fluent:mic-record-28-filled"
                width={28}
                height={28}
                className="text-primary-500 cursor-pointer"
              />
            </div>

            <div className="flex flex-row ml-[24px] w-[80.5%] ">
              <MessageInput />
            </div>

            <div className="flex items-center justify-start w-fit ml-[16px]">
              <div className="flex items-center ">
                <Image
                  src="/assets/images/icon.png"
                  alt="ava"
                  width={28}
                  height={28}
                  className="bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default RightMessage;
