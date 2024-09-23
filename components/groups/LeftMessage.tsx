"use client";
import React, { useState } from "react";
import GlobalSearch from "../search/globalSearch";
import MessageBox from "../shared/groupAttribute/MessageBox";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "../ui/button";
import { boxGroup, members } from "@/constants";

const LeftMessage = () => {
  const [box, setBox] = useState(boxGroup);

  const handleAddGroup = () => {
    const newGroup = {
      id: (parseInt(box[box.length - 1].id) + 1).toString(),
      groupId: (box.length + 1).toString(),
      groupName: `New Group ${box.length + 1}`,
      members: [],
      ava: "/assets/images/icon.png",
      content: "This is a new group message.",
      pin: false,
      time: "just now",
      isOnline: false,
      isSeen: false
    };

    setBox([...box, newGroup]); // Thêm nhóm mới vào danh sách
  };

  return (
    <div className="flex flex-col w-full h-full py-[16px] px-[8px]">
      <div className="text-dark100_light900 ">
        <p className="h2-medium">Groups</p>
      </div>

      <GlobalSearch />

      <div className="mt-[12px] flex w-full flex-col scrollable overflow-scroll overflow-x-hidden ">
        {boxGroup.length > 0
          ? boxGroup.map((item) => (
              <MessageBox
                key={item.id}
                id={item.groupId}
                groupId={item.groupId}
                groupName={item.groupName}
                members={item.members}
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
