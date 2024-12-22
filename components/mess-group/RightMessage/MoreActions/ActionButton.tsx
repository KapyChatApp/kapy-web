"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Actions {
  icon: string;
  label: string;
  click: string;
}
interface ActionButtonProps {
  action: Actions;
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  setActiveComponent
}) => {
  const pathname = usePathname();
  const isGroup = /^\/group-chat\/\d+$/.test(pathname);

  const { icon, label, click } = action;

  const [isNotified, setIsNotified] = useState(false);
  const [isFind, setIsFind] = useState(false);
  const [isBest, setIsBest] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isManage, setIsManage] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Kiểm tra kích thước màn hình
      if (window.matchMedia("(min-width: 768px)").matches) {
        setActiveComponent("");
      } else {
        setActiveComponent("");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setActiveComponent]);

  const handleButton = () => {
    switch (click) {
      case "notified":
        setIsNotified((prev) => !prev);
        break;
      case "find":
        setIsFind((prev) => !prev);
        setActiveComponent(click);
        break;
      case "block":
        setIsBlock((prev) => !prev);
        break;
      case "best":
        setIsBest((prev) => !prev);
        break;
      case "add":
        setIsAdd((prev) => !prev);
        setActiveComponent(click);
        break;
      case "manage":
        setIsManage((prev) => !prev);
        setActiveComponent(click);
        break;
    }
  };

  const displayLabel = isNotified ? "Turn on" : isBlock ? "Unblock" : label;
  const displayIcon = isNotified ? "mingcute:notification-off-fill" : icon;

  return (
    <div
      // className={`${
      //   isGroup ? "xl:min-w-[60px] w-fit" : "lg:min-w-[60px] w-[57px]"
      // } flex flex-col items-center justify-center gap-[8px]`}
      className={`w-fit flex flex-col items-center justify-center gap-[8px]`}
    >
      <Button className="flex items-center justify-center w-fit shadow-none hover:shadow-none focus:shadow-none outline-none border-none p-0">
        <div
          className={`flex flex-col items-center justify-center rounded-full p-[6px] ${
            isBest
              ? "bg-primary-500 bg-opacity-20"
              : isBlock
              ? "bg-accent-red bg-opacity-20"
              : "bg-light-700 dark:bg-dark-400 dar:bg-opacity-80"
          }`}
          onClick={handleButton}
        >
          <Icon
            icon={displayIcon}
            width={24}
            height={24}
            className={`${
              isBest
                ? "text-primary-500"
                : isBlock
                ? "text-accent-red"
                : "text-dark100_light900"
            } `}
          />
        </div>
      </Button>
      <p
        className={`${
          isBest
            ? "text-primary-500 small-regular"
            : isBlock
            ? "text-accent-red small-regular"
            : "text-dark100_light900 small-regular"
        }`}
      >
        {displayLabel}
      </p>
    </div>
  );
};

export default ActionButton;
