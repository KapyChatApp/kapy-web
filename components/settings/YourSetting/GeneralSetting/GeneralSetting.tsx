"use client";
import { LeftSidbarSettingProps } from "@/types/settings";
import React from "react";
import NotificationSound from "./NotificationSound";
import ThemeMode from "./ThemeMode";

const GeneralSetting = ({ setRenderRight }: LeftSidbarSettingProps) => {
  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full justify-start items-start">
        <NotificationSound />
        <ThemeMode />
      </div>
    </>
  );
};

export default GeneralSetting;
