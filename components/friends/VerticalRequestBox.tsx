"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import ConfirmModal from "./ConfirmModal";
import AccountModal from "./AccountModal";
import {
  FindUserDTO,
  FriendRequestDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";
import { useUserContext } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { acceptFriend } from "@/lib/services/friend/acceptFriend";
import { useFriendContext } from "@/context/FriendContext";
import { acceptBestFriend } from "@/lib/services/friend/accepBff";
import { handleAcceptBff, handleAcceptFr } from "@/lib/utils";

interface VerticalBoxProps {
  request: FriendResponseDTO | RequestedResponseDTO | FindUserDTO;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
}

const VerticalRequestBox: React.FC<VerticalBoxProps> = ({
  request,
  setIndex
}) => {
  const { adminInfo } = useUserContext();
  const { setListRequestedFriend } = useFriendContext();

  const object = request as RequestedResponseDTO;
  const label = object.relation === "friend" ? "Accept" : "Accept Bff";

  const handleButton = () => {
    if (object.relation === "friend") {
      try {
        const friendRequest: FriendRequestDTO = {
          sender: object._id,
          receiver: adminInfo._id
        };
        handleAcceptFr(friendRequest, setListRequestedFriend);
        setIndex(object._id);
      } catch (error) {
        console.error("Failed to accept friend request", error);
        toast({
          title: `Error in accept new friend`,
          description: error instanceof Error ? error.message : "Unknown error",
          className:
            "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
        });
      }
    } else if (object.relation === "bff") {
      try {
        const friendRequest: FriendRequestDTO = {
          sender: object._id,
          receiver: adminInfo._id
        };
        handleAcceptBff(friendRequest, setListRequestedFriend);
        setIndex(object._id);
      } catch (error) {
        console.error("Failed to accept best friend request", error);
        toast({
          title: `Error in accept best friend`,
          description: error instanceof Error ? error.message : "Unknown error",
          className:
            "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
        });
      }
    }
  };

  const [isClick, setClick] = useState(false);
  const handleClick = () => {
    setClick(!isClick);
  };

  const account = {
    user: object,
    setAccount: setClick
  };

  return (
    <>
      <Button
        className="flex flex-col shadow-none border-[0.5px] bg-transparent border-light-500 dark:border-dark-200 dark:border-opacity-50 rounded-lg p-3 items-center justify-center w-fit h-fit cursor-pointer hover:border-primary-100 hover:border-opacity-10 hover:bg-primary-100 hover:bg-opacity-10"
        onClick={handleClick}
      >
        <Image
          src={object.avatar}
          alt="ava"
          width={172}
          height={166}
          className="responsive-friend-vertical"
        />

        <div className="flex flex-col gap-1 w-full h-fit justify-center items-start mt-3">
          <p className="text-dark100_light900 base-medium">
            {object.firstName + " " + object.lastName}
          </p>
          {object.mutualFriends > 0 && (
            <p className="text-dark100_light900 body-regular">
              Mutual friends: {object.mutualFriends}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-fit h-fit justify-center items-center mt-4">
          <Button
            className={`px-12 flex flex-row gap-[6px] py-1 bg-primary-500 hover:bg-primary-500 border-none shadow-none w-full rounded-lg`}
            onClick={(e) => {
              e.stopPropagation();
              handleButton();
            }}
          >
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

export default VerticalRequestBox;
