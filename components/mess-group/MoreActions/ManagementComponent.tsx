import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { manage } from "@/constants/groups";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
interface ManagementProps {
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
}
const ManagementComponent = ({ setActiveComponent }: ManagementProps) => {
  const handleBack = () => {
    setActiveComponent("");
  };
  return (
    <div className="flex flex-col w-full h-full items-center justify-start">
      <div className="flex w-full bg-light-700 dark:bg-dark-400 dark:bg-opacity-80 rounded-[12px] justify-center items-center h-[80px]">
        <Button
          className="flex flex-row shadow-none border-none bg-transparent w-full items-center justify-around py-[28px] px-[0px] h-auto"
          onClick={handleBack}
        >
          <Icon
            icon="weui:back-filled"
            width={12}
            height={24}
            className="text-dark100_light900"
          />
          <p className="paragraph-semibold text-dark100_light900">
            Management of Group
          </p>
        </Button>
      </div>

      <div className="flex flex-col mt-[12px] w-full items-center justify-start gap-[24px] px-[8px]">
        <div className="flex flex-col w-full items-start justify-center gap-[12px]">
          <p className="body-semibold text-dark100_light900">
            Allow all members to:
          </p>
          <div className="flex flex-col w-full items-start justify-center gap-[12px]">
            {manage.map((item) => (
              <div className="flex items-center justify-between w-full">
                <label
                  htmlFor="terms2"
                  className="body-regular leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-dark100_light900"
                >
                  {item.label}
                </label>
                <Checkbox
                  id="terms2"
                  className={`data-[state=checked]:bg-primary-500 data-[state=checked]:text-light-900 disabled:opacity-1 h-[18px] w-[18px] border-none bg-light-500 dark:bg-dark-400 dark:bg-opacity-80`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between w-full ">
          <p className="body-semibold text-dark100_light900">
            Allow all members to:
          </p>
          <Checkbox
            id="terms2"
            className={`data-[state=checked]:bg-primary-500 data-[state=checked]:text-light-900 disabled:opacity-1 h-[18px] w-[28px] border-none bg-light-500 dark:bg-dark-400 dark:bg-opacity-80 rounded-[12px]`}
          />
        </div>

        <div className="flex w-full bg-light-700 dark:bg-dark-400 dark:bg-opacity-80 rounded-lg justify-center items-center">
          <Button className="flex flex-row shadow-none border-none bg-transparent w-full items-center justify-around py-[6px] px-0 h-auto">
            <p className="body-semibold text-dark100_light900">
              Management of Group
            </p>
            <Icon
              icon="ooui:next-ltr"
              width={12}
              height={24}
              className="text-dark100_light900"
            />
          </Button>
        </div>
      </div>

      <div className="flex flex-grow mt-auto w-full items-end justify-end">
        <Button className="flex flex-row shadow-none border-none bg-transparent w-full items-center justify-center py-[8px] bg-accent-red bg-opacity-20 rounded-lg hover:bg-accent-red hover:bg-opacity-20 ">
          <p className="paragraph-semibold text-accent-red">
            Disband this group
          </p>
        </Button>
      </div>
    </div>
  );
};

export default ManagementComponent;
