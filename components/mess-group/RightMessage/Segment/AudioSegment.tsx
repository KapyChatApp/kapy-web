"use client";
import React from "react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { FileContent, ResponseMessageDTO } from "@/lib/DTO/message";
import { useUserContext } from "@/context/UserContext";

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
  const { createBy, contentId } = segments;
  const { adminInfo } = useUserContext();
  const adminId = adminInfo._id;
  const isActive = createBy !== adminId;

  //Render Content
  const lastContent = contentId;
  const audioContent = lastContent as FileContent;

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

  return (
    <div
      className={`${getContainerClasses()} flex flex-wrap w-fit h-full items-center justify-center overflow-hidden`}
    >
      <audio
        controls
        className="md:w-[250px] h-[54px] w-[200px] md:text-[14px] text-[12px]"
      >
        <source src={audioContent.url} type="audio/ogg" />
      </audio>
    </div>
  );
};

export default MediaSegment;
