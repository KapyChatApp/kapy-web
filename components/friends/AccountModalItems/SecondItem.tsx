import { FriendProfileResponseDTO } from "@/lib/DTO/friend";
import { HistoryFindFriend } from "@/types/friends";
import { User } from "@/types/object";
import React from "react";
interface SecondItemProps {
  user: FriendProfileResponseDTO;
}

const SecondItem = ({ user }: SecondItemProps) => {
  const birth = new Date(user.birthDay).toLocaleDateString();
  return (
    <div className="flex flex-col items-start justify-start gap-3 w-full h-fit">
      <p className="text-dark100_light900 paragraph-15-regular">Information</p>
      <div className="flex flex-row w-full h-fit justify-start items-center">
        <div className="flex flex-col gap-3 w-fit h-fit items-start justify-center">
          <div className=" flex flex-row gap-[54px] w-full h-fit justify-start items-center">
            <div className="flex w-[70px] h-fit">
              <p className="text-dark-100 text-opacity-50 dark:text-light-900 dark:text-opacity-60 paragraph-15-regular">
                Bio:
              </p>
            </div>
            <p
              className={`text-dark-100 dark:text-light-900  ${
                user.bio && user.bio !== ""
                  ? " paragraph-15-regular text-opacity-80 dark:text-opacity-80"
                  : "body-regular text-opacity-50 dark:text-opacity-50"
              }`}
            >
              {user.bio && user.bio !== ""
                ? user.bio
                : "You can be set your own bio"}
            </p>
          </div>

          <div className=" flex flex-row gap-[54px] w-full h-fit justify-start items-center">
            <div className="flex w-[70px] h-fit">
              <p className="text-dark-100 text-opacity-50 dark:text-light-900 dark:text-opacity-60 paragraph-15-regular">
                Birth date:
              </p>
            </div>

            <p className="text-dark-100 text-opacity-80 dark:text-light-900 dark:text-opacity-80 paragraph-15-regular">
              {birth}
            </p>
          </div>

          <div className=" flex flex-row gap-[54px] w-full h-fit justify-start items-center">
            <div className="flex w-[70px] h-fit">
              <p className="text-dark-100 text-opacity-50 dark:text-light-900 dark:text-opacity-60 paragraph-15-regular">
                Gender:
              </p>
            </div>
            <p
              className={`text-dark-100 dark:text-light-900 paragraph-15-regular text-opacity-80 dark:text-opacity-80`}
            >
              {user.gender ? "Male" : "Female"}
            </p>
          </div>

          <div className=" flex flex-row gap-[54px] w-full h-fit justify-start items-center">
            <div className="flex w-[70px] h-fit">
              <p className="text-dark-100 text-opacity-50 dark:text-light-900 dark:text-opacity-60 paragraph-15-regular">
                Phone:
              </p>
            </div>

            <p className="text-dark-100 text-opacity-80 dark:text-light-900 dark:text-opacity-80 paragraph-15-regular">
              {user.phoneNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondItem;
