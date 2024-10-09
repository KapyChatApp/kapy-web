import { Button } from "@/components/ui/button";
import { sidebarSettingButton } from "@/constants/settings";
import { LeftSidbarSettingProps } from "@/types/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const LeftSidbarSetting = ({
  setRenderRight,
  renderRight
}: LeftSidbarSettingProps) => {
  return (
    <div className="flex flex-col items-center justify-start w-[34%] h-full background-light900_dark400">
      <div className="flex flex-col w-full h-full pt-4 px-1">
        {sidebarSettingButton.map((item) => (
          <Button
            className={`${
              renderRight === item.value
                ? "bg-light-700 dark:bg-dark-200 dark:bg-opacity-50"
                : "bg-transparent"
            } flex w-full h-fit rounded-lg hover:bg-light-700 dark:hover:bg-dark-200 dark:hover:bg-opacity-50 items-center justify-start py-3 pl-6 shadow-none border-none `}
            onClick={() => setRenderRight(item.value)}
          >
            <div className="flex flex-row gap-3 w-full h-fit">
              <Icon
                icon={item.icon}
                width={18}
                height={18}
                className="text-dark100_light900"
              />
              <p className="text-dark100_light900 paragraph-regular">
                {item.label}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LeftSidbarSetting;
