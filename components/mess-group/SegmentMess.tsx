"use client";
import {
  FileContent,
  GPSContent,
  ResponseMessageDTO
} from "@/lib/dataMessages";
import ReactPlayer from "react-player";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

interface SegmentMessage {
  segments: ResponseMessageDTO;
  index: number;
  length: number;
}

const SegmentMess: React.FC<SegmentMessage> = ({ segments, index, length }) => {
  const { createBy, contentId, text, createAt } = segments;
  const adminId = localStorage.getItem("adminId");
  const isActive = createBy !== adminId;
  const isFileContent = contentId.length > 0 && text.length === 0;
  const [isHovered, setIsHovered] = useState(false);

  //Render Content
  let renderedContent;
  const lastContent = contentId[contentId.length - 1]; // Lấy phần tử cuối cùng trong contentId
  const textContent = text[text.length - 1];

  //Rounded content
  const getContainerClasses = () => {
    if (length > 1) {
      if (isActive) {
        if (index === 0) {
          return isFileContent
            ? "rounded-t-[8px] rounded-br-[8px] rounded-bl-[4px] bg-transparent p-0"
            : "rounded-t-[18px] rounded-br-[18px] rounded-bl-[4px] bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1"; // Đầu tiên
        } else if (index === length - 1) {
          return isFileContent
            ? "rounded-b-[8px] rounded-tr-[8px] rounded-tl-[4px] bg-transparent p-0"
            : "rounded-b-[18px] rounded-tr-[18px] rounded-tl-[4px] bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1"; // Cuối cùng
        } else {
          return isFileContent
            ? "rounded-s-1 rounded-e-[8px] bg-transparent p-0"
            : "rounded-s-1 rounded-e-[18px] bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1"; // Ở giữa
        }
      } else {
        if (index === 0) {
          return isFileContent
            ? "rounded-t-[8px] rounded-br-[4px] rounded-bl-[8px] bg-transparent p-0"
            : "rounded-t-[18px] rounded-br-[4px] rounded-bl-[18px] bg-primary-500 px-3 py-1"; // Đầu tiên
        } else if (index === length - 1) {
          return isFileContent
            ? "rounded-b-[8px] rounded-tr-[4px] rounded-tl-[8px] bg-transparent p-0"
            : "rounded-b-[18px] rounded-tr-[4px] rounded-tl-[18px] bg-primary-500 px-3 py-1"; // Cuối cùng
        } else {
          return isFileContent
            ? "rounded-s-[8px] rounded-e-[4px] bg-transparent p-0"
            : "rounded-s-[18px] rounded-e-[4px] bg-primary-500 px-3 py-1"; // Ở giữa
        }
      }
    } else {
      if (isActive) {
        return isFileContent
          ? "bg-transparent p-0 rounded-[8px]"
          : "bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1 rounded-[18px]";
      }
      return isFileContent
        ? "bg-transparent p-0 rounded-[8px]"
        : "bg-primary-500 px-3 py-1 rounded-[18px]";
    }
  };

  if (text.length > 0 && contentId.length === 0) {
    renderedContent = textContent;
  } else if (contentId.length > 0 && text.length === 0) {
    if (lastContent.type === "Image") {
      const imageContent = lastContent as FileContent;
      renderedContent = (
        <Image
          src={imageContent.url}
          alt={imageContent.fileName}
          width={200}
          height={200}
          className={`${getContainerClasses()} max-w-full h-auto `}
        />
      );
    } else if (lastContent.type === "Video") {
      const videoContent = lastContent as FileContent;
      renderedContent = (
        <ReactPlayer
          url={videoContent.url}
          controls
          width="100%"
          height="auto"
        />
      );
    } else if (lastContent.type === "Audio") {
      const audioContent = lastContent as FileContent;
      renderedContent = (
        <audio controls>
          <source src={audioContent.url} type={audioContent.format} />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (lastContent.type === "Other") {
      const otherFileContent = lastContent as FileContent;
      renderedContent = (
        <Link
          href={otherFileContent.url}
          download
          className="text-accent-blue hover:underline"
          onClick={(e) => {
            e.preventDefault();
            console.log("Error loading file", e);
          }}
        >
          {otherFileContent.fileName}
        </Link>
      );
    }
  } else {
    console.log("Content type is not supported.");
  }

  const messageTime = new Date(createAt).toLocaleTimeString();

  return (
    <div
      className={`flex flex-row items-center justify-start w-fit gap-2 h-full  relative`}
      onMouseEnter={() => setIsHovered(true)} // Khi hover vào
      onMouseLeave={() => setIsHovered(false)} // Khi rời khỏi
    >
      {/* Hiển thị thời gian khi hover */}
      {isHovered && (
        <div
          className={`absolute ${
            isActive ? "right-[-74px]" : "left-[-76px]"
          }  w-fit center bg-dark-700 text-dark100_light900 text-[12px] opacity-80 p-1 rounded-md `}
        >
          {messageTime}
        </div>
      )}
      <div
        className={`${getContainerClasses()} flex flex-wrap w-fit h-full items-center justify-center`}
      >
        {/* Chỉ hiển thị đoạn văn bản nếu nội dung không phải là hình ảnh */}
        {text.length > 0 ? (
          <p
            className={`${
              isActive ? "text-dark100_light900" : "text-light-900"
            } flex-wrap md:text-[14px] text-[13px] font-[320px]`}
          >
            {renderedContent}
          </p>
        ) : (
          renderedContent // Hiển thị hình ảnh nếu nó là một hình ảnh
        )}
      </div>
    </div>
  );
};

export default SegmentMess;
