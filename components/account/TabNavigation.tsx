"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

const buttonTab = [
  { value: "post", label: "POSTS", icon: "mynaui:grid" },
  { value: "photo", label: "PHOTOS", icon: "proicons:photo" },
  { value: "reel", label: "REELS", icon: "mage:video-player" }
];

const TabNavigation = ({
  activeTab,
  setActiveTab
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex mt-11 border-t-light-700 w-full h-14 shrink-0 items-center justify-center border-t">
      <span className="flex h-full text-dark100_light900">
        {buttonTab.map((item, index) => (
          <button
            className={`flex items-center justify-center bg-transparent h-full ${
              activeTab === item.value
                ? "text-primary-500 border-t border-primary-500 mt-[-1px]"
                : ""
            } ${index === 0 ? "" : "ml-[60px]"}`}
            onClick={() => setActiveTab(item.value)}
          >
            <Icon
              icon={item.icon}
              width={12}
              height={12}
              className="mr-[6px]"
            />
            <span className="small-regular">{item.label}</span>
          </button>
        ))}
      </span>
    </div>
  );
};

export default TabNavigation;
