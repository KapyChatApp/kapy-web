"use client";
import { Button } from "@/components/ui/button";
import { SeeAllProps } from "@/types/mess-group";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { FileContent } from "@/lib/DTO/message";

const SeeAllPhoto: React.FC<SeeAllProps> = ({
  setActiveComponent,
  setItemSent,
  itemSent
}) => {
  const [photoList, setPhotoList] = useState<FileContent[]>([]);
  useEffect(() => {
    setPhotoList(itemSent as FileContent[]);
  }, [itemSent]);
  const handleBack = () => {
    setActiveComponent("");
  };
  //Show image in More
  useEffect(() => {
    // Khởi tạo Fancybox sau khi DOM đã sẵn sàng
    Fancybox.bind("[data-fancybox='more-image']", {
      Toolbar: true,
      Thumbs: true
    });
    return () => {
      Fancybox.destroy(); // Hủy Fancybox khi component unmount
    };
  }, []);
  return (
    <div className="flex flex-col items-center justify-start w-full h-fit gap-6">
      <div className="flex w-full bg-light-700 dark:bg-dark-400 dark:bg-opacity-80 rounded-[12px] justify-center items-center h-[80px]">
        <Button
          className="flex flex-row shadow-none border-none bg-transparent w-full items-center justify-start gap-3 py-[28px] h-auto"
          onClick={handleBack}
        >
          <Icon
            icon="formkit:arrowleft"
            width={28}
            height={28}
            className="text-dark100_light900"
          />
          <div className="flex justify-center items-end w-full">
            <p className="paragraph-semibold text-dark100_light900">
              Photos of Group
            </p>
            <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 paragraph-regular ml-1">
              ({photoList.length})
            </p>
          </div>
        </Button>
      </div>
      <div className="flex flex-row flex-wrap items-center w-full md:justify-start justify-start md:px-2 px-0 md:gap-2 gap-4">
        {photoList.length > 0
          ? photoList.map((item) => (
              <div className="flex w-[20%] md:w-[30%] relative">
                <a
                  href={item.url} // Thêm liên kết tới ảnh lớn
                  data-fancybox="more-image" // Kích hoạt Fancybox cho nhóm hình ảnh
                  className={` max-w-full h-auto cursor-pointer`}
                >
                  <Image
                    src={item.url}
                    alt={item.fileName}
                    width={500}
                    height={500}
                    className="w-full h-auto rounded-[4px] cursor-pointer object-cover"
                  />
                </a>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default SeeAllPhoto;
