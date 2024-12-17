"use client";
import { LeftSidbarSettingProps } from "@/types/settings";
import React, { useState } from "react";
import FirstFrame from "./FirstFrame";
import SecondFrame from "./SecondFrame";
import ThirdFrame from "./ThirdFrame";
import { useFriendContext } from "@/context/FriendContext";

const PrivacySetting = ({ setRenderRight }: LeftSidbarSettingProps) => {
  const [isSelectedMessage, setSelectedMessage] = useState("everyone");
  const [isSelectedCalling, setSelectedCalling] = useState("everyone");
  const { listBlockedFriend } = useFriendContext();

  const userBlock = listBlockedFriend;
  const [unBlock, setUnBlock] = useState(false);
  const [isIndex, setIndex] = useState("");

  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full justify-start items-start">
        <FirstFrame />

        <SecondFrame
          isSelectedCalling={isSelectedCalling}
          setSelectedCalling={setSelectedCalling}
          isSelectedMessage={isSelectedMessage}
          setSelectedMessage={setSelectedMessage}
        />

        <ThirdFrame
          userBlock={userBlock}
          unBlock={unBlock}
          setUnBlock={setUnBlock}
          setIndex={setIndex}
          isIndex={isIndex}
        />
      </div>
    </>
  );
};

export default PrivacySetting;
