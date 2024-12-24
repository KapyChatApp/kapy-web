"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import AccountModal from "./AccountModal";
import {
  FindUserDTO,
  FriendRequestDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";
import { useUserContext } from "@/context/UserContext";
import { useFriendContext } from "@/context/FriendContext";
import { handleAddfr, handleUnfr } from "@/lib/utils";

interface VerticalBoxProps {
  request: FriendResponseDTO | RequestedResponseDTO | FindUserDTO;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
}

const VerticalSuggestBox: React.FC<VerticalBoxProps> = ({
  request,
  setIndex
}) => {
  const { adminInfo } = useUserContext();
  const { setListFriend } = useFriendContext();
  const list = request;
  const friendRequest: FriendRequestDTO = {
    sender: adminInfo._id,
    receiver: list._id
  };

  const [status, setStatus] = useState("");
  const label = status === "" ? "Add friend" : "Cancel Request";
  const handleButton = () => {
    switch (label) {
      case "Add friend":
        handleAddfr(friendRequest);
        setStatus("cancel");
        break;
      case "Cancel Request":
        handleUnfr(friendRequest, setListFriend);
        setStatus("");
        break;
    }
  };

  const [isClick, setClick] = useState(false);
  const handleClick = () => {
    setClick(!isClick);
  };

  const account = {
    user: list,
    setAccount: setClick
  };

  return (
    <>
      <Button
        className="flex flex-col shadow-none border-[0.5px] bg-transparent border-light-500 dark:border-dark-200 dark:border-opacity-50 rounded-lg p-3 items-center justify-center w-fit h-fit cursor-pointer hover:border-primary-100 hover:border-opacity-10 hover:bg-primary-100 hover:bg-opacity-10"
        onClick={handleClick}
      >
        <Image
          src={list.avatar ? list.avatar : "/assets/ava/default.png"}
          alt="ava"
          width={172}
          height={166}
          className="responsive-friend-vertical"
        />

        <div className="flex flex-col gap-1 w-full h-fit justify-center items-start mt-3">
          <p className="text-dark100_light900 base-medium">
            {list.firstName + " " + list.lastName}
          </p>
          {list.mutualFriends > 0 && (
            <p className="text-dark100_light900 body-regular">
              Mutual friends: {list.mutualFriends}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-fit h-fit justify-center items-center mt-4">
          <Button
            className={`px-7 flex flex-row gap-[6px] py-1 bg-primary-500 hover:bg-primary-500 border-none shadow-none w-full rounded-lg`}
            onClick={(e) => {
              e.stopPropagation();
              handleButton();
            }}
          >
            <Icon
              icon={status === "" ? "mingcute:add-fill" : "iconoir:cancel"}
              width={14}
              height={14}
              className="text-light-900"
            />
            <p className="text-light-900 body-regular">{label}</p>
          </Button>

          {/* <Button
            className="flex flex-row px-7 bg-light-700 hover:bg-light-700 bg-opacity-80 hover:bg-opacity-80 dark:bg-dark-200 dark:hover:bg-dark-200 dark:bg-opacity-50 dark:hover:bg-opacity-50 border-none shadow-none w-full rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <p className="text-dark100_light900 body-regular">Remove</p>
          </Button> */}
        </div>
      </Button>

      {/* {isRemove && <ConfirmModal confirm={confirm} />} */}

      {isClick && <AccountModal account={account} />}
    </>
  );
};

export default VerticalSuggestBox;
