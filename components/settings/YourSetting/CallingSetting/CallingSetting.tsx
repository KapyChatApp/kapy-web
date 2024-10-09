"use client";
import { LeftSidbarSettingProps } from "@/types/settings";
import React, { useState } from "react";
import FirstFrame from "./FirstFrame";
import SecondFrame from "./SecondFrame";
import ThirdFrame from "./ThirdFrame";
import FourthFrame from "./FourthFrame";

const CallingSetting = ({ setRenderRight }: LeftSidbarSettingProps) => {
  const [isSelectedMicro, setSelectedMicro] = useState("default");
  const [isSelectedSpeaker, setSelectedSpeaker] = useState("default");
  const [isSelectedCamera, setSelectedCamera] = useState("default");
  return (
    <div className="flex flex-col gap-6 w-full h-full justify-start items-start">
      <FirstFrame />

      <SecondFrame
        isSelectedMicro={isSelectedMicro}
        setSelectedMicro={setSelectedMicro}
      />

      <ThirdFrame
        isSelectedSpeaker={isSelectedSpeaker}
        setSelectedSpeaker={setSelectedSpeaker}
      />

      <FourthFrame
        isSelectedCamera={isSelectedCamera}
        setSelectedCamera={setSelectedCamera}
      />
    </div>
  );
};

export default CallingSetting;
