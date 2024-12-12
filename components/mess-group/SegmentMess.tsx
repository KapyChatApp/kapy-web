"use client";
import React, { useState } from "react";
import ImageSegment from "./RightMessage/Segment/ImageSegment";
import TextSegment from "./RightMessage/Segment/TextSegment";
import VideoSegment from "./RightMessage/Segment/VideoSegment";
import AudioSegment from "./RightMessage/Segment/AudioSegment";
import OtherSegment from "./RightMessage/Segment/OtherSegment";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from "@/components/ui/menubar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "../ui/badge";
import { ResponseMessageDTO } from "@/lib/DTO/message";
import { useUserContext } from "@/context/UserContext";

interface SegmentMessage {
  segments: ResponseMessageDTO;
  index: number;
  length: number;
}

const SegmentMess: React.FC<SegmentMessage> = ({ segments, index, length }) => {
  const { createBy, contentId, text, createAt } = segments;
  const { adminInfo } = useUserContext();
  const adminId = adminInfo._id;
  const isActive = createBy !== adminId;
  const [isHovered, setIsHovered] = useState(false);

  //Render Content
  const textSegment = text;
  const contentSegment = contentId && !text;
  const imageSegment = contentSegment && contentId.type === "Image";
  const audioSegment = contentSegment && contentId.type === "Audio";
  const videoSegment = contentSegment && contentId.type === "Video";
  const otherSegment = contentSegment && contentId.type === "Other";

  return (
    <div
      className={`flex flex-row items-center justify-start w-fit gap-2 h-full  relative`}
    >
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
