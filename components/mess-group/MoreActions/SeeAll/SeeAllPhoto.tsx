import { Button } from "@/components/ui/button";
import { Photo } from "@/types/media";
import { ActiveComponentProps, SeeAllProps } from "@/types/mess-group";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

const SeeAllPhoto: React.FC<SeeAllProps> = ({
  setActiveComponent,
  setItemSent,
  itemSent
}) => {
  const photoList = itemSent as Photo[];
  const handleBack = () => {
    setActiveComponent("");
  };
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
      <div className="flex flex-row flex-wrap items-center w-full justify-between px-2 gap-2">
        {photoList.length > 0
          ? photoList.map((item) => (
              <div className="flex w-[30%] relative">
                <Image
                  src={item.path}
                  alt={item.fileName}
                  width={100}
                  height={100}
                  className="rounded-[4px] cursor-pointer"
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default SeeAllPhoto;
