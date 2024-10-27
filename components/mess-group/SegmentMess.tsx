import { SegmentMessProps } from "@/types/mess-group";
import Image from "next/image";

import { usePathname } from "next/navigation";
import React from "react";

interface SegmentMessage {
  segments: SegmentMessProps;
  index: number;
  length: number;
}

const SegmentMess: React.FC<SegmentMessage> = ({ segments, index, length }) => {
  const pathname = usePathname();

  const { userId, content } = segments;
  const isActive = userId !== "001";

  //Render Content
  let renderedContent;
  if (typeof content === "string") {
    // Nội dung là văn bản
    renderedContent = content;
  } else if (content?.type === "image") {
    // Nội dung là hình ảnh
    renderedContent = (
      <Image
        src={content.url}
        alt={content.type}
        width={200}
        height={100}
        className="max-w-full h-auto rounded-lg"
      />
    );
  } else if (content?.type === "link") {
    // Nội dung là liên kết
    renderedContent = (
      <a
        href={content.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500"
      >
        {content.url}
      </a>
    );
  } else if (content?.type === "file") {
    // Nội dung là tệp
    renderedContent = (
      <a
        href={content.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500"
      >
        {content.fileName}
      </a>
    );
  }

  //Rounded content
  const getContainerClasses = () => {
    if (typeof content !== "string" && content.type === "image") {
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
        {typeof content !== "object" || content.type !== "image" ? (
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
