import React, { useRef, useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./styles.css";
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import Image from "next/image";
import { FileResponseDTO } from "@/lib/DTO/map";
import ReactPlayer from "react-player";
import { FileSegment } from "@/components/ui/file-segment";

export default function SwiperStyle({
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
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper"
      >
        {contents.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="w-[468px] h-[585px] flex justify-center items-center">
              {item.type === "Image" && (
                <Image alt="" src={item.url} width={468} height={585} />
              )}

              {item.type === "Video" && (
                <ReactPlayer
                  url={item.url}
                  controls
                  width="468px"
                  height="585px"
                  className="max-w-full h-auto"
                />
              )}

              {item.type === "Audio" && (
                <audio
                  controls
                  className="h-[54px] w-[300px] md:text-[14px] text-[12px]"
                >
                  <source src={item.url} type="audio/ogg" />
                </audio>
              )}

              {item.type !== "Image" &&
                item.type !== "Video" &&
                item.type !== "Audio" && (
                  <div className="flex flex-wrap w-full h-full items-center justify-center border-[0.5px] border-light-500 ">
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
