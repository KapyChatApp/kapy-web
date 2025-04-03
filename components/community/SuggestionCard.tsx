"use client";
import { FriendRequestDTO, FriendResponseDTO } from "@/lib/DTO/friend";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/UserContext";
import { handleAddfr, handleUnfr } from "@/lib/utils";

const SuggestionCard = ({ item }: { item: FriendResponseDTO }) => {
  const { adminId } = useUserContext();
  const [label, setLabel] = useState("Add");
  const friendRequest: FriendRequestDTO = {
    sender: adminId,
    receiver: item._id
  };
  const handleAddFriend = () => {
    if (label === "Add") {
      setLabel("Cancel");
      handleAddfr(friendRequest);
    } else {
      setLabel("Add");
      handleUnfr(friendRequest);
    }
  };
  return (
    <div className="flex w-full h-fit justify-between items-center mt-4">
      <div className="flex w-auto items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={item.avatar !== "" ? item.avatar : "/assets/ava/default.png"}
            alt=""
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start ml-3">
          <span className="text-dark100_light900 body-regular">
            {item.firstName} {item.lastName}
          </span>
          <span className="text-dark600_light500 small-light">
            {item.mutualFriends.length} muatual friends
          </span>
        </div>
      </div>

      <div className="w-fit h-full items-center">
        <Button
          className={`${
            label === "Add"
              ? "border-[0.5px] border-primary-500"
              : "border-none"
          } w-fit h-fit bg-transparent px-4 py-1  shadow-none hover:bg-none items-center justify-center rounded-2xl`}
          onClick={handleAddFriend}
        >
          <span
            className={`${
              label === "Add" ? "text-primary-500" : "text-accent-red"
            } body-regular`}
          >
            {label}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SuggestionCard;
