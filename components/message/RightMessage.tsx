"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import MessageFriend from "../shared/messAttibute/MessageFriend";
import MessageInput from "../shared/messAttibute/MessageInput";
import ToggleButton from "../shared/button/ToggleButton";

const data = [
  {
    id: "1",
    friend: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: {
      text: ["Hello, how are you?", "Check out this picture!"],
      image: ["/assets/images/picture1.jpg", "/assets/images/picture2.jpg"],
      link: ["https://example.com"]
    },
    createdAt: "2024-09-19T10:30:00Z",
    isOnline: true
  },
  {
    id: "2",
    friend: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: {
      text: ["Here is the link to the article."],
      image: [],
      link: ["https://example.com/article"]
    },
    createdAt: "2024-09-19T09:15:00Z",
    isOnline: false
  },
  {
    id: "3",
    friend: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: {
      text: ["Had a great day today!"],
      image: ["/assets/images/dayout.jpg"],
      link: []
    },
    createdAt: "2024-09-18T17:45:00Z",
    isOnline: true
  }
];

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

  return (
    <section className="flex bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full py-[16px] px-[12px] gap-2">
        <div className="flex flex-row h-[48px] w-full ml-[6px] justify-between items-center">
          <div className="flex flex-row">
            <div className="flex items-center bg-transparent relative">
              <Image
                src="/assets/ava/ava1.jpg"
                alt="ava"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
            </div>
            <div className="flex items-center justify-center ml-[8px]">
              <p className="paragraph-regular">Junnie</p>
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

        <div className="flex flex-row w-full h-full scrollable overflow-scroll">
          <div className="flex flex-col w-full h-full mt-[16px]">
            {data.length > 0
              ? data.map((item) => (
                  <MessageFriend
                    key={item.id}
                    id={item.id}
                    friend={item.friend}
                    ava={item.ava}
                    content={item.content}
                    createdAt={item.createdAt}
                    isOnline={item.isOnline}
                  ></MessageFriend>
                ))
              : null}
          </div>
        </div>

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
  );
};

export default RightMessage;
