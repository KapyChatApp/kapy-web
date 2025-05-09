"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import OtherBoxButton from "./OtherBoxButton";
import AccountModal from "./AccountModal";
import {
  FindUserDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";
import { useRouter } from "next/navigation";

export interface OtherBoxButtonProps {
  icon: string;
  label: string;
  value: string;
}
const otherBox: OtherBoxButtonProps[] = [
  {
    icon: "tabler:message-circle",
    label: "Message",
    value: "message"
  },
  {
    icon: "tabler:friends-off",
    label: "Unfriend",
    value: "unfriend"
  },
  {
    icon: "material-symbols:block",
    label: "Block",
    value: "block"
  }
];

interface FriendBoxProps {
  friend: FriendResponseDTO | RequestedResponseDTO | FindUserDTO;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
}

const FriendBox: React.FC<FriendBoxProps> = ({ friend, setIndex }) => {
  const [isPop, setPop] = useState(false);

  const info = friend;
  const router = useRouter();
  const handleClick = () => {
    router.push(`/account/${info._id}`);
  };
  return (
    <div className="flex flex-row shadow-none border-[0.5px] bg-transparent border-light-500 dark:border-dark-200 dark:border-opacity-50 rounded-lg p-4 items-center justify-between w-full h-fit">
      <div
        className="flex flex-row justify-start items-center gap-3 w-fit h-fit cursor-pointer"
        onClick={handleClick}
      >
        <div className="w-20 h-20 relative overflow-hidden rounded-lg">
          <Image
            src={info.avatar ? info.avatar : "/assets/ava/default.png"}
            alt="ava"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-start items-start gap-2 ">
          <p className="text-dark100_light900 base-medium">
            {info.firstName + " " + info.lastName}
          </p>
          {info.mutualFriends.length > 0 && (
            <p className="text-dark100_light900 body-regular">
              Mutual friends: {info.mutualFriends.length}
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
        <PopoverContent className="flex flex-col background-light900_dark200 h-fit rounded-lg justify-start items-start dark:border-dark-300">
          {otherBox.map((item) => (
            <OtherBoxButton account={info} other={item} setIndex={setIndex} />
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FriendBox;
