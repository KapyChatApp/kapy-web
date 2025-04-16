"use client";
import { FileResponseDTO } from "@/lib/DTO/map";
import { Fancybox } from "@fancyapps/ui";
import Image from "next/image";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";

const MediaGrid = ({
  mediaList,
  isPhoto
}: {
  mediaList: FileResponseDTO[];
  isPhoto: boolean;
}) => {
  //Show image in More
  useEffect(() => {
    // Khởi tạo Fancybox sau khi DOM đã sẵn sàng
    Fancybox.bind(
      `${
        isPhoto ? "[data-fancybox='post-image']" : "[data-fancybox='post-reel']"
      }`,
      {
        Toolbar: true,
        Thumbs: true
      }
    );
    return () => {
      Fancybox.destroy(); // Hủy Fancybox khi component unmount
    };
  }, []);
  return mediaList.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
      {mediaList.map((item) => (
        <div className="relative w-full ">
          <a
            href={item.url} // Thêm liên kết tới ảnh lớn
            data-fancybox={isPhoto ? "post-image" : "post-reel"} // Kích hoạt Fancybox cho nhóm hình ảnh
            className={`max-w-full`}
          >
            {isPhoto ? (
              <img
                src={item.url}
                alt={item.fileName}
                className="w-full h-full aspect-square object-cover rounded-md"
              />
            ) : (
              // <div className="rounded-[4px] overflow-hidden">
              //                   <ReactPlayer
              //                     url={item.url}
              //                     controls
              //                     width="200px"
              //                     height="120px"
              //                     className="max-w-full h-auto"
              //                   />
              //                 </div>
              <video
                src={item.url}
                className="w-full h-full aspect-square object-cover rounded-md"
                controls
              />
            )}
          </a>
        </div>
      ))}
    </div>
  ) : (
    <div className="w-full items-center justify-center flex h-full">
      <span className="text-dark100_light900 paragraph-light italic">
        {isPhoto ? "No Photos" : "No Reels"}
      </span>
    </div>
  );
};

export default MediaGrid;
