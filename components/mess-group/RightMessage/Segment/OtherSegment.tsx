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
import { FileSegment } from "@/components/ui/file-segment";

interface SegmentMessage {
  segments: ResponseMessageDTO;
  index: number;
  length: number;
}

const OtherSegment: React.FC<SegmentMessage> = ({
  segments,
  index,
  length
}) => {
  const { createBy, contentId, text, createAt } = segments;
  const adminId = localStorage.getItem("adminId");
  const isActive = createBy !== adminId;
  const [isHovered, setIsHovered] = useState(false);

  //Render Content
  const lastContent = contentId[contentId.length - 1];
  const otherFileContent = lastContent as FileContent;

  //Rounded content
  const getContainerClasses = () => {
    if (length > 1) {
      if (isActive) {
        if (index === 0) {
          return "background-light700_dark200 bg-opacity-50 p-3 rounded-t-[18px] rounded-br-[18px] rounded-bl-[4px]";
        } else if (index === length - 1) {
          return "background-light700_dark200 bg-opacity-50 p-3 rounded-b-[18px] rounded-tr-[18px] rounded-tl-[4px] rounded-tr-[18px]";
        } else {
          return "background-light700_dark200 bg-opacity-50 dark:bg-opacity p-3 rounded-s-1 rounded-e-[18px]";
        }
      } else {
        if (index === 0) {
          return "background-light700_dark200 bg-opacity-50 dark:bg-opacity p-3 rounded-t-[18px] rounded-br-[4px] rounded-bl-[18px]";
        } else if (index === length - 1) {
          return "background-light700_dark200 bg-opacity-50 dark:bg-opacity  p-3 rounded-b-[18px] rounded-tr-[4px] rounded-tl-[18px]";
        } else {
          return "background-light700_dark200 bg-opacity-50 dark:bg-opacity p-3 rounded-s-[18px] rounded-e-[4px]";
        }
      }
    } else {
      if (isActive) {
        return "background-light700_dark200 bg-opacity-50 p-3 rounded-[18px]";
      }
      return "background-light700_dark200 bg-opacity-50 p-3 rounded-[18px]";
    }
  };

  const messageTime = new Date(createAt).toLocaleTimeString();

  return (
    <div
      className={`flex flex-row items-center justify-start w-fit gap-2 h-full  relative cursor-pointer`}
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
        <FileSegment
          fileName={lastContent.fileName}
          url={otherFileContent.url}
        />
      </div>
    </div>
  );
};

export default OtherSegment;
