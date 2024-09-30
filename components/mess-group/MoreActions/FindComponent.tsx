"use client";
import LocalSearch from "@/components/shared/search/localSearchbar";
import { Button } from "@/components/ui/button";
import { ActiveComponentProps } from "@/types/mess-group";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import React from "react";

const FindComponent: React.FC<ActiveComponentProps> = ({
  setActiveComponent
}) => {
  const pathname = usePathname();
  const isGroup = /^\/groups\/\d+$/.test(pathname);
  const handleBack = () => {
    setActiveComponent("");
  };
  return (
    <div className="flex flex-col w-full h-full ">
      <div className="flex w-full bg-light-700 dark:bg-dark-400 dark:bg-opacity-80 rounded-[12px] justify-center items-center">
        <Button
          className="flex flex-row shadow-none border-none bg-transparent w-full items-center justify-start gap-3 py-[28px] px-8 h-auto"
          onClick={handleBack}
        >
          <Icon
            icon="formkit:arrowleft"
            width={28}
            height={28}
            className="text-dark100_light900"
          />
          <p className="paragraph-semibold text-dark100_light900">
            {isGroup ? "Find messages of Group" : "Find your messages"}
          </p>
        </Button>
      </div>

      <span className="background-light600_dark400 w-full h-[0.5px] mt-5"></span>

      <div className="flex flex-row w-full h-full mt-6 px-2 overflow-scroll scrollable">
        <LocalSearch otherClasses="bg-transparent border border-light-500 dark:border-dark-500 w-full" />
      </div>
    </div>
  );
};

export default FindComponent;
