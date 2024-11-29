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

const TextSegment: React.FC<SegmentMessage> = ({ segments, index, length }) => {
  const { createBy, contentId, text, createAt } = segments;
  const adminId = localStorage.getItem("adminId");
  const isActive = createBy !== adminId;
  const [isHovered, setIsHovered] = useState(false);

  //Render Content
  let renderedContent;
  const textContent = text[text.length - 1];

  //Rounded content
  const getContainerClasses = () => {
    if (length > 1) {
      if (isActive) {
        if (index === 0) {
          return "rounded-t-[18px] rounded-br-[18px] rounded-bl-[4px] bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1";
        } else if (index === length - 1) {
          return "rounded-b-[18px] rounded-tr-[18px] rounded-tl-[4px] bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1";
        } else {
          return "rounded-s-1 rounded-e-[18px] bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1";
        }
      } else {
        if (index === 0) {
          return "rounded-t-[18px] rounded-br-[4px] rounded-bl-[18px] bg-primary-500 px-3 py-1";
        } else if (index === length - 1) {
          return "rounded-b-[18px] rounded-tr-[4px] rounded-tl-[18px] bg-primary-500 px-3 py-1";
        } else {
          return "rounded-s-[18px] rounded-e-[4px] bg-primary-500 px-3 py-1";
        }
      }
    } else {
      if (isActive) {
        return "bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1 rounded-[18px]";
      }
      return "bg-primary-500 px-3 py-1 rounded-[18px]";
    }
  };

  if (text.length > 0 && contentId.length === 0) {
    renderedContent = textContent;
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
        <p
          className={`${
            isActive ? "text-dark100_light900" : "text-light-900"
          } flex-wrap md:text-[14px] text-[13px] font-[320px]`}
        >
          {textContent}
        </p>
      </div>
    </div>
  );
};

export default TextSegment;