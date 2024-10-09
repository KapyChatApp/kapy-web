"use client";
import { LeftSidbarSettingProps } from "@/types/settings";
import React, { useState } from "react";
import { user } from "@/constants/object";
import FirstFrame from "./FirstFrame";
import SecondFrame from "./SecondFrame";
import ThirdFrame from "./ThirdFrame";

const PrivacySetting = ({ setRenderRight }: LeftSidbarSettingProps) => {
  const [isSelectedMessage, setSelectedMessage] = useState("everyone");
  const [isSelectedCalling, setSelectedCalling] = useState("everyone");

  const [unBlock, setUnBlock] = useState(false);
  const userBlock = user.filter((item) => item.status === "block");
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
