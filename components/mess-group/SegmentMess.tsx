"use client";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import React, { useState } from "react";
import ImageSegment from "./RightMessage/Segment/ImageSegment";
import TextSegment from "./RightMessage/Segment/TextSegment";
import VideoSegment from "./RightMessage/Segment/VideoSegment";
import AudioSegment from "./RightMessage/Segment/AudioSegment";
import OtherSegment from "./RightMessage/Segment/OtherSegment";

interface SegmentMessage {
  segments: ResponseMessageDTO;
  index: number;
  length: number;
}

const SegmentMess: React.FC<SegmentMessage> = ({ segments, index, length }) => {
  const { createBy, contentId, text, createAt } = segments;
  const adminId = localStorage.getItem("adminId");
  const isActive = createBy !== adminId;
  const [isHovered, setIsHovered] = useState(false);

  //Render Content
  const lastContent = contentId[contentId.length - 1]; // Lấy phần tử cuối cùng trong contentId
  const textContent = text[text.length - 1];
  const textSegment = text.length > 0;
  const contentSegment = contentId.length > 0 && text.length === 0;
  const imageSegment = contentSegment && lastContent.type === "Image";
  const audioSegment = contentSegment && lastContent.type === "Audio";
  const videoSegment = contentSegment && lastContent.type === "Video";
  const otherSegment = contentSegment && lastContent.type === "Other";

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

      {textSegment && (
        <TextSegment segments={segments} index={index} length={length} />
      )}
      {imageSegment && (
        <ImageSegment segments={segments} index={index} length={length} />
      )}
      {videoSegment && (
        <VideoSegment segments={segments} index={index} length={length} />
      )}
      {audioSegment && (
        <AudioSegment segments={segments} index={index} length={length} />
      )}
      {otherSegment && (
        <OtherSegment segments={segments} index={index} length={length} />
      )}
    </div>
  );
};

export default SegmentMess;
