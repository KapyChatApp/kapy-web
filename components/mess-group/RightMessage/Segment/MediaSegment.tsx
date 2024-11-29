"use client";
import { FileContent, ResponseMessageDTO } from "@/lib/dataMessages";
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

const MediaSegment: React.FC<SegmentMessage> = ({
  segments,
  index,
  length
}) => {
  const { createBy, contentId, text, createAt } = segments;
  const adminId = localStorage.getItem("adminId");
  const isActive = createBy !== adminId;
  const [isHovered, setIsHovered] = useState(false);

  //Render Content
  let renderedContent;
  const lastContent = contentId[contentId.length - 1]; // Lấy phần tử cuối cùng trong contentId

  //Rounded content
  const getContainerClasses = () => {
    if (length > 1) {
      if (isActive) {
        if (index === 0) {
          return "bg-transparent p-0 rounded-t-[8px] rounded-br-[8px] rounded-bl-[4px] ";
        } else if (index === length - 1) {
          return "bg-transparent p-0 rounded-b-[8px] rounded-tr-[8px] rounded-tl-[4px] ";
        } else {
          return "bg-transparent p-0 rounded-s-1 rounded-e-[8px]";
        }
      } else {
        if (index === 0) {
          return "bg-transparent p-0 rounded-t-[8px] rounded-br-[4px] rounded-bl-[8px]";
        } else if (index === length - 1) {
          return "bg-transparent p-0 rounded-b-[8px] rounded-tr-[4px] rounded-tl-[8px]";
        } else {
          return "bg-transparent p-0 rounded-s-[8px] rounded-e-[4px] ";
        }
      }
    } else {
      if (isActive) {
        return "bg-transparent p-0 rounded-[8px]";
      }
      return "bg-transparent p-0 rounded-[8px]";
    }
  };

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
      <div className="rounded-[18px] overflow-hidden">
        <ReactPlayer
          url={videoContent.url}
          controls
          width="100%"
          height="auto"
        />
      </div>
    );
  } else if (lastContent.type === "Audio") {
    const audioContent = lastContent as FileContent;
    renderedContent = (
      <audio controls>
        <source src={audioContent.url} type={audioContent.format} />
        Your browser does not support the audio element.
      </audio>
    );
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
        className={`${getContainerClasses()} flex flex-wrap w-fit h-full items-center justify-center rounded-[18px] overflow-hidden`}
      >
        {renderedContent}
      </div>
    </div>
  );
};

export default MediaSegment;
