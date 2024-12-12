"use client";
import { FileContent, ResponseMessageDTO } from "@/lib/DTO/message";
import ReactPlayer from "react-player";
import React, { useEffect } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { useUserContext } from "@/context/UserContext";

interface SegmentMessage {
  segments: ResponseMessageDTO;
  index: number;
  length: number;
}

const VideoSegment: React.FC<SegmentMessage> = ({
  segments,
  index,
  length
}) => {
  const { createBy, contentId } = segments;
  const { adminInfo } = useUserContext();
  const adminId = adminInfo._id;
  const isActive = createBy !== adminId;

  //Show image in Chat
  useEffect(() => {
    // Khởi tạo Fancybox sau khi DOM đã sẵn sàng
    Fancybox.bind("[data-fancybox='gallery']", {
      Toolbar: true,
      Thumbs: true
    });
    return () => {
      Fancybox.destroy(); // Hủy Fancybox khi component unmount
    };
  }, []);

  //Render Content
  const lastContent = contentId;
  const videoContent = lastContent as FileContent;

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
    <div className={`flex flex-wrap w-fit h-full items-center justify-center`}>
      <a
        href={videoContent.url}
        data-fancybox="gallery"
        className={` max-w-full h-auto cursor-pointer`}
      >
        <div className="rounded-[18px] overflow-hidden">
          <ReactPlayer
            url={videoContent.url}
            controls
            width="200px"
            height="200px"
            className="max-w-full h-auto"
          />
        </div>
      </a>
    </div>
  );
};

export default VideoSegment;
