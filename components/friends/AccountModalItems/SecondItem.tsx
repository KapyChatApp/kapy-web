import { HistoryFindFriend } from "@/types/friends";
import { User } from "@/types/object";
import React from "react";
interface SecondItemProps {
  user: User | HistoryFindFriend;
}

const SecondItem = ({ user }: SecondItemProps) => {
  return (
    <div className="flex flex-col items-start justify-start gap-3 w-full h-fit">
      <p className="text-dark100_light900 paragraph-15-regular">Information</p>
      <div className="flex flex-row gap-[54px] w-full h-fit justify-start items-center">
        <div className="flex flex-col gap-3 w-fit h-fit items-start justify-center">
          <p className="text-dark-100 text-opacity-50 dark:text-light-900 dark:text-opacity-60 paragraph-15-regular">
            Bio:
          </p>
          <p className="text-dark-100 text-opacity-50 dark:text-light-900 dark:text-opacity-60 paragraph-15-regular">
            Birth date:
          </p>
          <p className="text-dark-100 text-opacity-50 dark:text-light-900 dark:text-opacity-60 paragraph-15-regular">
            Phone:
          </p>
        </div>

        <div className="flex flex-col gap-3 w-fit h-fit items-start justify-center">
          <p className="text-dark-100 text-opacity-80 dark:text-light-900 dark:text-opacity-80 paragraph-15-regular">
            {user.bio}
          </p>
          <p className="text-dark-100 text-opacity-80 dark:text-light-900 dark:text-opacity-80 paragraph-15-regular">
            {user.birth.toLocaleDateString()}
          </p>
          <p className="text-dark-100 text-opacity-80 dark:text-light-900 dark:text-opacity-80 paragraph-15-regular">
            {user.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecondItem;
