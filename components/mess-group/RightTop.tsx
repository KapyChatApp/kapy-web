"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { RightTopProps } from "@/types/mess-group";

interface rightTop {
  top: RightTopProps;
}

const RightTop: React.FC<rightTop> = ({ top }) => {
  const { ava, name, membersGroup, onlineGroup, openMore, setOpenMore } = top;

  const pathname = usePathname();
  const isActiveGroup = /^\/groups\/\d+$/.test(pathname);

  return isActiveGroup ? (
    <div className="flex flex-row h-fit w-full ml-[6px] justify-between items-center">
      <div className="flex flex-row">
        <div className="flex items-center bg-transparent relative">
          <Image
            src={ava}
            alt="ava"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
        </div>
        {isActiveGroup ? (
          <div className="flex flex-col justify-start ml-[8px] gap-[6px]">
            <div className="flex items-center justify-start">
              <p className="paragraph-regular text-dark100_light900">{name}</p>
            </div>
            <div className="flex items-center justify-start">
              <p className="small-light text-dark100_light900">
                {membersGroup} members, {onlineGroup} onlines
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center ml-[8px]">
            <p className="paragraph-regular text-dark100_light900">{name}</p>
          </div>
        )}
      </div>
      <div className="flex flex-row items-start justify-center h-full">
        <Button className="flex bg-transparent cursor-pointer py-[12px] px-[8px] shadow-none hover:shadow-none focus:shadow-none outline-none border-none">
          <Icon
            icon="fluent:video-20-filled"
            width={24}
            height={24}
            className="text-primary-500"
          />
        </Button>

        <Button className="flex bg-transparent cursor-pointer py-[12px] px-[8px] shadow-none hover:shadow-none focus:shadow-none outline-none border-none">
          <Icon
            icon="ion:call"
            width={24}
            height={24}
            className="text-primary-500"
          />
        </Button>

        <Button
          className="flex bg-transparent cursor-pointer py-[12px] px-[8px] shadow-none hover:shadow-none focus:shadow-none outline-none border-none"
          onClick={() => setOpenMore(!openMore)}
        >
          <Icon
            icon="basil:other-1-outline"
            width={24}
            height={24}
            className={`rounded-full transition-colors duration-200 ease-in-out ${
              openMore
                ? "bg-primary-500 text-light-900"
                : "text-primary-500 bg-transparent"
            }`}
          />
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex flex-row h-fit w-full ml-[6px] justify-between items-center">
      <div className="flex flex-row">
        <div className="flex items-center bg-transparent relative">
          <Image
            src={ava}
            alt="ava"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
        </div>
        {isActiveGroup ? (
          <div className="flex flex-col justify-start ml-[8px] gap-[6px]">
            <div className="flex items-center justify-start">
              <p className="paragraph-regular text-dark100_light900">{name}</p>
            </div>
            <div className="flex items-center justify-start">
              <p className="small-light text-dark100_light900">
                {membersGroup} members, {onlineGroup} onlines
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center ml-[8px]">
            <p className="paragraph-regular text-dark100_light900">{name}</p>
          </div>
        )}
      </div>
      <div className="flex flex-row items-start justify-center h-full">
        <Button className="flex bg-transparent cursor-pointer py-[12px] px-[8px] shadow-none hover:shadow-none focus:shadow-none outline-none border-none">
          <Icon
            icon="fluent:video-20-filled"
            width={24}
            height={24}
            className="text-primary-500"
          />
        </Button>

        <Button className="flex bg-transparent cursor-pointer py-[12px] px-[8px] shadow-none hover:shadow-none focus:shadow-none outline-none border-none">
          <Icon
            icon="ion:call"
            width={24}
            height={24}
            className="text-primary-500"
          />
        </Button>

        <Button
          className="flex bg-transparent cursor-pointer py-[12px] px-[8px] shadow-none hover:shadow-none focus:shadow-none outline-none border-none"
          onClick={() => setOpenMore(!openMore)}
        >
          <Icon
            icon="basil:other-1-outline"
            width={24}
            height={24}
            className={`rounded-full transition-colors duration-200 ease-in-out ${
              openMore
                ? "bg-primary-500 text-light-900"
                : "text-primary-500 bg-transparent"
            }`}
          />
        </Button>
      </div>
    </div>
  );
};

export default RightTop;
