import { Button } from "@/components/ui/button";
import { ActiveComponentProps, SeeAllProps } from "@/types/mess-group";
import { MememberGroup } from "@/types/object";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

const SeeAllMember: React.FC<SeeAllProps> = ({
  setActiveComponent,
  setItemSent,
  itemSent
}) => {
  const memberList = itemSent as MememberGroup[];
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
          ? memberList
              .sort((a, b) => (a.addedBy === "" ? -1 : 1))
              .map((item) => (
                <div
                  className="flex flex-row items-center justify-start w-full gap-[12px]"
                  key={item.id}
                >
                  <div className="relative flex-shrink-0 w-fit">
                    <Image
                      src={item.ava}
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
                      {item.username}
                    </p>
                    <div className="flex items-center justify-start w-full min-w-0">
                      {item.addedBy === "" ? (
                        <p className="small-regular justify-start items-center text-primary-500 h-fit">
                          Leader
                        </p>
                      ) : (
                        <div className="flex items-center">
                          <p className="small-regular justify-start text-dark100_light900 h-fit">
                            Added by
                          </p>
                          <p className="small-regular ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900 h-fit">
                            {item.addedBy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
          : null}
      </div>
    </div>
  );
};

export default SeeAllMember;
