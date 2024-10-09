import { Button } from "@/components/ui/button";
import { Links } from "@/types/media";
import { ActiveComponentProps, SeeAllProps } from "@/types/mess-group";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";

const SeeAllLink: React.FC<SeeAllProps> = ({
  setActiveComponent,
  setItemSent,
  itemSent
}) => {
  const linkList = itemSent as Links[];
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
              Links of Group
            </p>
            <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 paragraph-regular ml-1">
              ({linkList.length})
            </p>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-start w-full gap-5 px-2">
        {linkList.length > 0
          ? linkList.slice(0, 3).map((item) => {
              let icon = item.icon;
              let iconDrive = "logos:google-drive";
              switch (item.type) {
                case "drive":
                  icon = iconDrive;
                  break;
                default:
                  icon = "ph:link-bold";
              }
              return (
                <div className="flex flex-row relative gap-3 items-center justify-start">
                  <Icon
                    icon={icon}
                    width={30}
                    height={30}
                    className={`${item.type === " " ? "text-primary-500" : ""}`}
                  />
                  <Link
                    href={item.path}
                    className="flex flex-grow items-center justify-start text-dark100_light900 paragraph-regular "
                  >
                    {item.linkName}
                  </Link>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default SeeAllLink;
