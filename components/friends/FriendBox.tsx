"use client";
import { User } from "@/types/object";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { otherBox } from "@/constants/friends";
import OtherBoxButton from "./OtherBoxButton";
import AccountModal from "./AccountModal";

interface FriendBoxProps {
  friend: User;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
}

const FriendBox: React.FC<FriendBoxProps> = ({ friend, setIndex }) => {
  const [isClick, setClick] = useState(false);
  const [isPop, setPop] = useState(false);

  const info = friend;
  const handleClick = () => {
    setClick(!isClick);
  };
  const account = {
    user: info,
    setAccount: setClick
  };
  return (
    <>
      <Button
        className="flex flex-row shadow-none border-[0.5px] bg-transparent border-light-500 dark:border-dark-200 dark:border-opacity-50 rounded-lg p-4 items-center justify-between w-full h-fit"
        onClick={handleClick}
      >
        <div className="flex flex-row justify-start items-center gap-3 w-fit h-fit">
          <Image
            src={info.ava}
            alt="ava"
            width={80}
            height={80}
            className="rounded-lg"
          />
          <div className="flex flex-col justify-start items-start gap-2 ">
            <p className="text-dark100_light900 base-medium">{info.name}</p>
            {info.mutualFriend > 0 && (
              <p className="text-dark100_light900 body-regular">
                Mutual friends: {info.mutualFriend}
              </p>
            )}
          </div>
        </div>

        <Popover onOpenChange={(open) => setPop(open)}>
          <PopoverTrigger>
            <div className="flex border-none shadow-none rounded-full p-2 hover:bg-light-700 dark:hover:bg-dark-200 hover:bg-opacity-50 dark:hover:bg-opacity-50 bg-transparent w-fit h-fit">
              <Icon
                icon="basil:other-1-outline"
                width={18}
                height={18}
                className="text-dark100_light900"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col background-light900_dark200 h-fit rounded-lg justify-start items-start">
            {otherBox.map((item) => (
              <OtherBoxButton account={info} other={item} setIndex={setIndex} />
            ))}
          </PopoverContent>
        </Popover>
      </Button>

      {isClick && !isPop && <AccountModal account={account} />}
    </>
  );
};

export default FriendBox;
