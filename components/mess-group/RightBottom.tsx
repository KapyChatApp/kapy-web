"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useRef } from "react";
import Image from "next/image";
import MessageInput from "./MessageInput";
import { Button } from "../ui/button";

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
      <div className="flex flex-row gap-[16px] items-center justify-center">
        <Icon
          icon="carbon:add-filled"
          width={28}
          height={28}
          className="text-primary-500 cursor-pointer"
        />
        <Button
          className="flex border-none shadow-none w-fit h-fit bg-transparent p-0"
          onClick={handleIconClick}
        >
          <Icon
            icon="basil:picture-solid"
            width={28}
            height={28}
            className="text-primary-500 cursor-pointer"
          />
        </Button>
        <Icon
          icon="fluent:mic-record-28-filled"
          width={28}
          height={28}
          className="text-primary-500 cursor-pointer"
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

      <div className="flex flex-row ml-[24px] w-[80.5%] ">
        <MessageInput />
      </div>

      <div className="flex items-center justify-start w-fit ml-[16px]">
        <div className="flex items-center ">
          <Image
            src="/assets/images/icon.png"
            alt="ava"
            width={28}
            height={28}
            className="bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default RightBottom;
