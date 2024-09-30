"use client";
import React, { useState } from "react";
import GlobalSearch from "../shared/search/globalSearch";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "../ui/button";
import { boxGroup } from "@/constants/groups";
import MessageBox from "../mess-group/MessageBox";
import CreateGroup from "./CreateGroup";

const LeftGroup = () => {
  const [box, setBox] = useState(boxGroup);
  const [isCreated, setCreated] = useState(false);

  const handleCreated = () => {
    setCreated(!isCreated);
  };

  const handleAddGroup = () => {
    const newGroup = {
      id: (parseInt(box[box.length - 1].id) + 1).toString(),
      otherId: (box.length + 1).toString(),
      otherName: `New Group ${box.length + 1}`,
      ava: "/assets/images/icon.png",
      sender: "",
      content: "This is a new group message.",
      pin: false,
      time: "just now",
      isOnline: false,
      isSeen: false
    };

    setBox([...box, newGroup]);
    console.log(box);
  };

  return (
    <>
      <div className="flex flex-col background-light900_dark400 w-full h-full py-[16px] px-[8px] rounded-tl-[12px] rounded-bl-[12px]">
        <p className="h2-medium text-dark100_light900">Group</p>

        <GlobalSearch />

        <div className="mt-[12px] flex w-full flex-col scrollable overflow-scroll overflow-x-hidden ">
          {box.length > 0 ? box.map((item) => <MessageBox box={item} />) : null}
        </div>

        <div className="flex flex-row mt-auto justify-start w-full">
          <Button
            className="shadow-none border-none min-w-fit bg-transparent min-h-fit p-0 flex flex-row items-center justify-start"
            onClick={handleCreated}
          >
            <div className="rounded-full p-[12px] bg-primary-500 bg-opacity-20">
              <Icon icon="mingcute:add-fill" className=" text-primary-500  " />
            </div>
            <p className="paragraph-semibold text-primary-500 ml-[12px]">
              Create group
            </p>
          </Button>
        </div>
      </div>

      {isCreated && <CreateGroup setCreated={setCreated} />}
    </>
  );
};

export default LeftGroup;
