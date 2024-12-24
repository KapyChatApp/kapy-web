"use client";
import { FileContent, ResponseMessageDTO } from "@/lib/DTO/message";
import Image from "next/image";
import React, { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

interface SegmentMessage {
  segments: ResponseMessageDTO;
  index: number;
  length: number;
}

const ImageSegment: React.FC<SegmentMessage> = ({
  segments,
  index,
  length
}) => {
  const { createBy, contentId } = segments;
  const { adminInfo } = useUserContext();
  const adminId = adminInfo._id;
  const isActive = createBy !== adminId;

  //Show image in More
  useEffect(() => {
    // Khởi tạo Fancybox sau khi DOM đã sẵn sàng
    Fancybox.bind("[data-fancybox='gallery']", {
      Toolbar: true,
      Thumbs: true
    });
    return () => {
      Fancybox.destroy();
    };
  }, []);

  //Render Content
  const lastContent = contentId;
  const imageContent = lastContent as FileContent;
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
      <a
        href={imageContent.url} // Thêm liên kết tới ảnh lớn
        data-fancybox="gallery" // Kích hoạt Fancybox cho nhóm hình ảnh
        className={`max-w-full h-auto cursor-pointer`}
      >
        <Image
          src={imageContent.url}
          alt={imageContent.fileName}
          width={200}
          height={200}
          className="max-w-full h-auto"
        />
      </a>
    </div>
  );
};

export default ImageSegment;
