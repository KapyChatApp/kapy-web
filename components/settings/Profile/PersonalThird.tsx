"use client";
import { PersonalItemProps } from "@/types/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const PersonalThird = ({ personal }: PersonalItemProps) => {
  const user = personal;

  const [windowWidth, setWindowWidth] = useState<number>(0);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const imagesToShow = windowWidth >= 1024 ? 5 : 4;
  return (
    <div className="flex flex-col items-start justify-start gap-3 w-full h-fit">
      <p className="text-dark100_light900 paragraph-15-regular">Pictures</p>
      <div className="flex flex-row flex-wrap justify-between items-center w-full h-fit cursor-pointer">
        {user.image.slice(0, imagesToShow).map((item, index) => (
          <div key={index} className="relative">
            <Image
              src={item.path}
              alt="photo"
              width={80}
              height={80}
              className="rounded-lg"
            />
            {index === imagesToShow - 1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className=" bg-dark-500 bg-opacity-50 rounded-lg h-full w-full items-center justify-center flex cursor-pointer">
                  <Icon
                    icon="basil:other-1-outline"
                    width={40}
                    height={40}
                    className="text-light-900 "
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalThird;
