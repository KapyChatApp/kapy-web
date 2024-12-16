"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { StrangeFriend } from "@/types/friends";
import { usePathname } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import AccountModal from "./AccountModal";
import {
  FindUserDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";

interface VerticalBoxProps {
  request: FriendResponseDTO | RequestedResponseDTO | FindUserDTO;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
}

const VerticalBox: React.FC<VerticalBoxProps> = ({ request, setIndex }) => {
  const pathname = usePathname();
  const getPathNameMatch = () => {
    const paths = ["all-friend", "best-friend", "suggestion", "request"];
    return paths.find((path) =>
      new RegExp(`^/friends/${path}(\\/.*)?$`).test(pathname)
    );
  };
  const matchedPath = getPathNameMatch();
  const label =
    (request as RequestedResponseDTO | FindUserDTO).relation === "friend"
      ? "Accept"
      : "Add friend";

  const list = request;

  const [status, setStatus] = useState("");
  const handleButton = () => {
    if (label === "Accept") {
      setIndex(list._id);
    }
    setStatus("cancel");
  };
  const handleCancel = () => {
    setStatus("");
  };

  const [isRemove, setRemove] = useState(false);
  const handleRemove = () => {
    setRemove(!isRemove);
  };

  const [isClick, setClick] = useState(false);
  const handleClick = () => {
    setClick(!isClick);
  };

  const confirm = {
    setConfirm: setRemove,
    setIndex: setIndex,
    listId: list._id,
    name: list.firstName + " " + list.lastName,
    action: "remove"
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
          src={list.avatar}
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
          {status === "" ? (
            <Button
              className={`${
                matchedPath === "request" ? "px-12" : "px-7"
              } flex flex-row gap-[6px] py-1 bg-primary-500 hover:bg-primary-500 border-none shadow-none w-full rounded-lg`}
              onClick={(e) => {
                e.stopPropagation();
                handleButton();
              }}
            >
              {matchedPath === "suggestion" && (
                <Icon
                  icon="mingcute:add-fill"
                  width={14}
                  height={14}
                  className="text-light-900"
                />
              )}
              <p className="text-light-900 body-regular">{label}</p>
            </Button>
          ) : (
            <Button
              className={`${
                matchedPath === "request" ? "px-12" : "px-7"
              } flex flex-row gap-[6px] py-1 bg-primary-500 hover:bg-primary-500 border-none shadow-none w-full rounded-lg`}
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
            >
              {matchedPath === "suggestion" && (
                <Icon
                  icon="iconoir:cancel"
                  width={14}
                  height={14}
                  className="text-light-900"
                />
              )}
              <p className="text-light-900 body-regular">Cancel request</p>
            </Button>
          )}

          <Button
            className="flex flex-row px-7 bg-light-700 hover:bg-light-700 bg-opacity-80 hover:bg-opacity-80 dark:bg-dark-200 dark:hover:bg-dark-200 dark:bg-opacity-50 dark:hover:bg-opacity-50 border-none shadow-none w-full rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <p className="text-dark100_light900 body-regular">Remove</p>
          </Button>
        </div>
      </Button>

      {isRemove && <ConfirmModal confirm={confirm} />}

      {isClick && <AccountModal account={account} />}
    </>
  );
};

export default VerticalBox;
