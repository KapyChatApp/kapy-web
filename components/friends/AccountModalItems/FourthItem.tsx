import { Switch } from "@/components/ui/switch";
import { HistoryFindFriend } from "@/types/friends";
import { User } from "@/types/object";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface FourthItemProps {
  user: User | HistoryFindFriend;
}

const FourthItem = ({ user }: FourthItemProps) => {
  return (
    <div className="flex flex-col items-start justify-start gap-3 w-full h-fit">
      <div className="flex flex-row items-center justify-start h-fit w-full gap-2">
        <p className="text-dark100_light900 paragraph-15-regular">
          Mutual group
        </p>
        <p className="text-dark100_light900 paragraph-15-light">
          ({user.mutualGroup})
        </p>
      </div>

      <div className="flex flex-row items-center justify-between h-fit w-full">
        <div className="flex flex-row gap-3 w-fit h-fit items-center">
          <Icon
            icon="mdi:user-block"
            width={18}
            height={18}
            className="text-dark100_light900"
          />
          <p className="text-dark100_light900 paragraph-15-regular">
            Block message and friend
          </p>
        </div>

        <div className="flex h-fit w-fit">
          <Switch id="block-mode" />
        </div>
      </div>
    </div>
  );
};

export default FourthItem;
