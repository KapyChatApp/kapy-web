"use client";
import React, { useRef, useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./styles.css";

// import required modules
import Image from "next/image";
import { FileResponseDTO } from "@/lib/DTO/map";
import ReactPlayer from "react-player";
import { FileSegment } from "@/components/ui/file-segment";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";

export default function SwiperDetailPost({
  contents
}: {
  contents: FileResponseDTO[];
}) {
  return (
    <>
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel]}
        className="mySwiper"
      >
        {contents.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full flex justify-center items-center background-light900_dark200 rounded-l-lg">
              {item.type === "Image" && (
                <Image
                  alt=""
                  src={item.url}
                  width={468}
                  height={585}
                  className="object-cover w-full h-full"
                />
              )}

              {item.type === "Video" && (
                <div className="flex flex-wrap w-full h-full items-center justify-center background-light900_dark200 rounded-l-lg">
                  <ReactPlayer
                    url={item.url}
                    controls
                    width="468px"
                    height="668px"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {item.type === "Audio" && (
                <div className="flex flex-wrap w-full h-full items-center justify-center border-[0.25px] border-light500_dark400 background-light900_dark200 rounded-l-lg">
                  <audio
                    controls
                    className="h-[54px] w-[300px] md:text-[14px] text-[12px]"
                  >
                    <source src={item.url} type="audio/ogg" />
                  </audio>
                </div>
              )}

              {item.type !== "Image" &&
                item.type !== "Video" &&
                item.type !== "Audio" && (
                  <div className="flex flex-wrap w-full h-full items-center justify-center border-[0.25px] border-light500_dark400 background-light900_dark200 rounded-l-lg">
                    <FileSegment fileName={item.fileName} url={item.url} />
                  </div>
                )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
