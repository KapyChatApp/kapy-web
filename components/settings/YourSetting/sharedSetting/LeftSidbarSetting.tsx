"use client";
import { Button } from "@/components/ui/button";
import { sidebarSettingButton } from "@/constants/settings";
import { LeftSidbarSettingProps } from "@/types/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface props {
  setShowRight: React.Dispatch<React.SetStateAction<boolean>>;
  left: LeftSidbarSettingProps;
  showRight: boolean;
  showLeft: boolean;
  handleRender: () => JSX.Element;
}

const LeftSidbarSetting = ({
  left,
  setShowRight,
  showRight,
  showLeft,
  handleRender
}: props) => {
  const { setRenderRight, renderRight } = left;
  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      {(!showRight || !showLeft) && (
        <div
          className={`${
            showLeft ? "pt-3" : "pt-4"
          } flex flex-col w-full h-full px-1`}
        >
          {sidebarSettingButton.map((item) => (
            <div
              className={`${
                renderRight === item.value
                  ? "bg-light-700 dark:bg-dark-200 dark:bg-opacity-50"
                  : "bg-transparent hover:bg-light-700 dark:hover:bg-dark-200 dark:hover:bg-opacity-30 hover:bg-opacity-40"
              } flex w-full h-fit rounded-lg items-center justify-start py-3 pl-6 shadow-none border-none `}
              onClick={() => {
                setRenderRight(item.value);
                setShowRight(true);
              }}
            >
              <div className="flex flex-row gap-3 w-full h-fit items-end">
                <Icon
                  icon={item.icon}
                  width={20}
                  height={20}
                  className="text-dark100_light900"
                />
                <p className="text-dark100_light900 paragraph-regular">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {showRight && showLeft && handleRender()}
    </div>
  );
};

export default LeftSidbarSetting;
