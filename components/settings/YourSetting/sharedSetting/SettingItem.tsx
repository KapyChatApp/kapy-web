import { SettingItemProps } from "@/types/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface generalItem {
  general: SettingItemProps;
}

const SettingItem: React.FC<generalItem> = ({ general }) => {
  const { icon, title, description } = general;
  return (
    <div className="flex flex-row gap-3 items-start justify-start w-fit h-fit">
      {icon && (
        <Icon
          icon={icon}
          width={18}
          height={18}
          className="text-dark100_light900 mt-[3px]"
        />
      )}

      <div className="flex flex-col items-start justify-start h-fit w-fit gap-1">
        <p className="text-dark100_light900 body-regular">{title}</p>
        {description !== "dark" &&
          description !== "light" &&
          description !== "system" && (
            <p className="text-dark100_light900 small-11-regular text-opacity-60 flex-wrap w-[80%]">
              {description}
            </p>
          )}
      </div>
    </div>
  );
};

export default SettingItem;
