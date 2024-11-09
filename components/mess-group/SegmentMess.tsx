import {
  FileContent,
  GPSContent,
  ImageContent,
  LinkContent,
  RenderMessageSegment,
  VideoContent,
  VoiceContent
} from "@/lib/dataMessages";
import { SegmentMessProps } from "@/types/mess-group";
import Image from "next/image";

import { usePathname } from "next/navigation";
import React from "react";

interface SegmentMessage {
  segments: RenderMessageSegment;
  index: number;
  length: number;
  adminId: string;
}

const SegmentMess: React.FC<SegmentMessage> = ({
  segments,
  index,
  length,
  adminId
}) => {
  const pathname = usePathname();

  const { infoCreateBy, contentId } = segments;
  const isActive = infoCreateBy.id !== adminId;

  //Render Content
  let renderedContent;
  const lastContent = contentId[contentId.length - 1]; // Lấy phần tử cuối cùng trong contentId

  if (typeof lastContent.content === "string") {
    renderedContent = lastContent.content;
  } else if (lastContent.content.type === "image") {
    // Nội dung là hình ảnh
    const imageContent = lastContent.content as ImageContent;
    renderedContent = (
      <Image
        src={imageContent.url}
        alt={imageContent.altText || "Image"}
        width={200}
        height={100}
        className="max-w-full h-auto rounded-lg"
      />
    );
  } else if (lastContent.content.type === "link") {
    // Nội dung là liên kết
    const linkContent = lastContent.content as LinkContent;
    renderedContent = (
      <a
        href={linkContent.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-blue"
      >
        {linkContent.title || linkContent.url}
      </a>
    );
  } else if (lastContent.content.type === "file") {
    // Nội dung là tệp
    const fileContent = lastContent.content as FileContent;
    renderedContent = (
      <a
        href={fileContent.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500"
      >
        {fileContent.fileName}
      </a>
    );
  } else if (lastContent.content.type === "video") {
    // Nội dung là video
    const videoContent = lastContent.content as VideoContent;
    renderedContent = (
      <video width={200} controls>
        <source src={videoContent.fileUrl} type={videoContent.fileType} />
        Your browser does not support the video tag.
      </video>
    );
  } else if (lastContent.content.type === "voice") {
    // Nội dung là giọng nói (audio)
    const voiceContent = lastContent.content as VoiceContent;
    renderedContent = (
      <audio controls>
        <source src={voiceContent.fileUrl} type={voiceContent.fileType} />
        Your browser does not support the audio element.
      </audio>
    );
  } else if (lastContent.content.type === "gps") {
    // Nội dung là thông tin GPS
    const gpsContent = lastContent.content as GPSContent;
    renderedContent = (
      <div>
        <p>
          Location: {gpsContent.latitude}, {gpsContent.longitude}
        </p>
        {gpsContent.description && <p>{gpsContent.description}</p>}
      </div>
    );
  } else {
    console.log("Content type is not supported.");
  }

  //Rounded content
  const getContainerClasses = () => {
    if (
      typeof lastContent.content !== "string" &&
      lastContent.content.type === "image"
    ) {
      return "bg-transparent p-0 rounded-lg"; // Nếu là hình ảnh, giữ nguyên bo góc
    }
    if (length > 1) {
      if (isActive) {
        if (index === 0) {
          return "rounded-t-[18px] rounded-br-[18px] rounded-bl-[4px] bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1"; // Đầu tiên
        } else if (index === length - 1) {
          return "rounded-b-[18px] rounded-tr-[18px] rounded-tl-[4px] bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1"; // Cuối cùng
        } else {
          return "rounded-s-1 rounded-e-[18px] bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1"; // Ở giữa
        }
      } else {
        if (index === 0) {
          return "rounded-t-[18px] rounded-br-[4px] rounded-bl-[18px] bg-primary-500 px-3 py-1"; // Đầu tiên
        } else if (index === length - 1) {
          return "rounded-b-[18px] rounded-tr-[4px] rounded-tl-[18px] bg-primary-500 px-3 py-1"; // Cuối cùng
        } else {
          return "rounded-s-[18px] rounded-e-[4px] bg-primary-500 px-3 py-1"; // Ở giữa
        }
      }
    }
    return isActive
      ? "bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-1 rounded-[18px]"
      : "bg-primary-500 px-3 py-1 rounded-[18px]";
  };

  return (
    <div
      className={`flex flex-row items-center justify-start w-fit gap-2 h-full  relative`}
    >
      <div
        className={`${getContainerClasses()} flex flex-wrap w-fit h-full items-center justify-center`}
      >
        {/* Chỉ hiển thị đoạn văn bản nếu nội dung không phải là hình ảnh */}
        {typeof lastContent.content !== "object" ||
        lastContent.content.type !== "image" ? (
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
