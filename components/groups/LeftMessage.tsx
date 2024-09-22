"use client";
import React, { useState } from "react";
import GlobalSearch from "../search/globalSearch";
import MessageBox from "../shared/groupAttribute/MessageBox";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "../ui/button";

const LeftMessage = () => {
  const [box, setBox] = useState([
    {
      id: "1",
      username: "Group ATSH",
      ava: "/assets/ava/ava1.jpg",
      content:
        "Hello I am Hello I am Hello I am Hello I am a girl in your life",
      sender: "You",
      pin: true,
      time: "4 min",
      isOnline: true,
      isSeen: true
    },
    {
      id: "2",
      username: "Team good boy",
      ava: "/assets/ava/ava2.jpg",
      content: "Hello",
      sender: "MasterD",
      pin: false,
      time: "4 min",
      isOnline: true,
      isSeen: true
    },
    {
      id: "3",
      username: "Team dev",
      ava: "/assets/ava/ava1.jpg",
      content: "Hello",
      sender: "Junnie",
      pin: false,
      time: "4 min",
      isOnline: false,
      isSeen: false
    }
  ]);

  const handleAddGroup = () => {
    const newGroup = {
      id: (box.length + 1).toString(), // Tạo ID mới
      username: `New Group ${box.length + 1}`,
      ava: "/assets/images/icon.png",
      content: "This is a new group message.",
      sender: "You",
      pin: false,
      time: "just now",
      isOnline: false,
      isSeen: true
    };
    setBox([...box, newGroup]); // Thêm nhóm mới vào danh sách
  };

  return (
    <div className="flex flex-col w-full h-full py-[16px] px-[8px]">
      <div className="text-dark100_light900 ">
        <p className="h2-medium">Groups</p>
      </div>

      <GlobalSearch />

      <div className="mt-[12px] flex w-full flex-col overflow-y-auto overflow-x-hidden ">
        {box.length > 0
          ? box.map((item) => (
              <MessageBox
                key={item.id}
                id={item.id}
                username={item.username}
                sender={item.sender}
                ava={item.ava}
                content={item.content}
                pin={item.pin}
                time={item.time}
                isOnline={item.isOnline}
                isSeen={item.isSeen}
              />
            ))
          : null}
      </div>

      <div className="flex flex-row mt-auto justify-start w-full">
        <Button
          className="shadow-none border-none min-w-fit bg-transparent min-h-fit p-0 flex flex-row items-center justify-start"
          onClick={handleAddGroup}
        >
          <div className="rounded-full p-[12px] bg-primary-500 bg-opacity-20">
            <Icon icon="mingcute:add-fill" className=" text-primary-500  " />
          </div>
          <p className="paragraph-semibold text-primary-500 ml-[12px]">
            Add group
          </p>
        </Button>
      </div>
    </div>
  );
};

export default LeftMessage;
