"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useRef } from "react";
import Image from "next/image";
import MessageInput from "../MessageInput";
import { Button } from "../../ui/button";

const RightBottom = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleIconClick = () => {
    if (fileInputRef.current) {
      console.log("File explorer is opened");
      fileInputRef.current.click();
    }
  };
  return (
    <div className="flex flex-row bg-transparent items-center justify-start w-full">
      <div className="flex flex-row lg:gap-4 gap-3 items-center justify-center">
        <Icon
          icon="carbon:add-filled"
          width={28}
          height={28}
          className="text-primary-500 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
        />
        <Button
          className="flex border-none shadow-none w-fit h-fit bg-transparent p-0"
          onClick={handleIconClick}
        >
          <Icon
            icon="basil:picture-solid"
            width={28}
            height={28}
            className="text-primary-500 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
          />
        </Button>
        <Icon
          icon="fluent:mic-record-28-filled"
          width={28}
          height={28}
          className="text-primary-500 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
        />
      </div>
      {/* Input file ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            console.log("File đã chọn:", selectedFile);
          }
        }}
      />

      <div className="flex flex-row lg:ml-[24px] ml-2 w-[80.5%] ">
        <MessageInput />
      </div>

      <div className="flex items-center justify-start w-fit lg:ml-[16px] ml-1">
        <div className="flex items-center w-6 h-6 xl:w-[28px] xl:h-[28px] justify-start">
          <Image
            src="/assets/images/icon.png"
            alt="ava"
            width={28}
            height={28}
            className="w-full h-auto  cursor-pointer object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default RightBottom;
