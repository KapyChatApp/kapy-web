import { Button } from "@/components/ui/button";
import { UserInfoBox } from "@/lib/DTO/message";
import { ActiveComponentProps, SeeAllProps } from "@/types/mess-group";
import { MememberGroup } from "@/types/object";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

const SeeAllMember: React.FC<SeeAllProps> = ({
  detailByBox,
  setActiveComponent,
  setItemSent,
  itemSent
}) => {
  const memberList = itemSent as UserInfoBox[];
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
              Members of Group
            </p>
            <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 paragraph-regular ml-1">
              ({memberList.length})
            </p>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center w-full gap-4 px-2">
        {memberList.length > 0
          ? memberList.map((item) => (
              <div
                className="flex flex-row items-center justify-start w-full gap-[12px]"
                key={item.id}
              >
                <div className="relative flex-shrink-0 w-fit">
                  <Image
                    src={item.avatar}
                    alt="ava"
                    width={42}
                    height={42}
                    className="rounded-full"
                  />
                  {item.isOnline && (
                    <div className="bg-green-600 rounded-full w-[10px] h-[8px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
                  )}
                </div>

                <div className="flex flex-col bg-transparent items-start justify-start gap-[2px] flex-grow overflow-hidden min-w-0">
                  <p className="paragraph-regular text-dark100_light900 h-fit">
                    {item.firstName + " " + item.lastName}
                  </p>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default SeeAllMember;
