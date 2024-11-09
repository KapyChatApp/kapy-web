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
  const isGroup = /^\/group-chat\/\d+$/.test(pathname);
  const handleBack = () => {
    setActiveComponent("");
  };
  return (
    <div className="flex flex-col w-full h-full ">
      <Button
        className="flex shadow-none border-none bg-transparent w-full items-center justify-end px-0 h-auto"
        onClick={handleBack}
      >
        <Icon
          icon="iconoir:cancel"
          width={28}
          height={28}
          className="text-dark100_light900 text-opacity-60"
        />
      </Button>

      <div className="flex flex-row w-full h-full px-2 overflow-scroll scrollable">
        <LocalSearch otherClasses="bg-transparent border border-light-500 dark:border-dark-500 w-full" />
      </div>
    </div>
  );
};

export default FindComponent;
