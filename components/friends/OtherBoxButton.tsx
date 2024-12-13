"use client";
import { OtherBoxButtonProps } from "@/types/friends";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { User } from "@/types/object";
import { useParams, usePathname } from "next/navigation";
import { FriendResponseDTO } from "@/lib/DTO/friend";

interface OtherButton {
  account: FriendResponseDTO;
  other: OtherBoxButtonProps;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
}

const OtherBoxButton: React.FC<OtherButton> = ({
  account,
  other,
  setIndex
}) => {
  const info = account;
  const { icon, label } = other;

  const pathname = usePathname();
  const containsBestFriend = /^\/friends\/best-friend(\/.*)?$/.test(pathname);
  const displayedLabel =
    containsBestFriend && icon === "solar:heart-bold"
      ? "Not in best friend list"
      : label;

  const handleNotBest = () => {
    if (containsBestFriend) {
      setIndex(info._id);
    }
  };

  const handleButton = () => {
    switch (label) {
      case "Best friend":
        handleNotBest();
        break;
      case "Block":
        setIndex(info._id);
        break;
      default:
        setIndex(info._id);
        break;
    }
  };
  return (
    <div className="flex w-full h-fit">
      <Button
        className="flex flex-row w-full py-2 px-3 gap-3 shadow-none border-none hover:background-light700_dark400 rounded-lg justify-start items-end"
        onClick={handleButton}
      >
        <Icon
          icon={icon}
          width={20}
          height={20}
          className={
            icon === "solar:heart-bold"
              ? "text-primary-500"
              : "text-dark100_light900"
          }
        />
        <p className="text-dark100_light900 paragraph-regular">
          {displayedLabel}
        </p>
      </Button>
    </div>
  );
};

export default OtherBoxButton;
