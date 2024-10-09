import { PersonalItemProps } from "@/types/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

const PersonalThird = ({ personal }: PersonalItemProps) => {
  const user = personal;
  return (
    <div className="flex flex-col items-start justify-start gap-3 w-full h-fit">
      <p className="text-dark100_light900 paragraph-15-regular">Pictures</p>
      <div className="flex flex-row flex-wrap justify-between items-center w-full h-fit cursor-pointer">
        {user.image.slice(0, 5).map((item, index) => (
          <div key={index} className="relative">
            <Image
              src={item.path}
              alt="photo"
              width={80}
              height={80}
              className="rounded-lg"
            />
            {index === 4 && (
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
