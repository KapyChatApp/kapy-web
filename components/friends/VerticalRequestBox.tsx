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
import {
  handleAcceptBff,
  handleAcceptFr,
  handleUnBff,
  handleUnfr
} from "@/lib/utils";
import { useRouter } from "next/navigation";

interface VerticalBoxProps {
  request: FriendResponseDTO | RequestedResponseDTO | FindUserDTO;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
}

const VerticalRequestBox: React.FC<VerticalBoxProps> = ({
  request,
  setIndex
}) => {
  const { adminInfo } = useUserContext();
  const { setListRequestedFriend, setListBestFriend, setListFriend } =
    useFriendContext();
  const router = useRouter();
  const object = request as RequestedResponseDTO;

  let label = "";
  switch (object.relation) {
    case "received_friend":
      label = "Accept";
      break;
    case "received_bff":
      label = "Accept Bff";
      break;
    case "sent_friend":
      label = "Cancel request";
      break;
    case "sent_bff":
      label = "Cancel request bff";
      break;
  }
  const handleButton = () => {
    if (object.relation === "received_friend") {
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
    } else if (object.relation === "received_bff") {
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
    } else if (object.relation === "sent_friend") {
      try {
        const friendRequest: FriendRequestDTO = {
          sender: adminInfo._id,
          receiver: object._id
        };
        handleUnfr(friendRequest, setListFriend);
        setIndex(object._id);
      } catch (error) {
        console.error("Failed to friend unrequest", error);
        toast({
          title: `Error in unrequest friend`,
          description: error instanceof Error ? error.message : "Unknown error",
          className:
            "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
        });
      }
    } else {
      try {
        const friendRequest: FriendRequestDTO = {
          sender: adminInfo._id,
          receiver: object._id
        };
        handleUnBff(friendRequest, setListBestFriend);
        setIndex(object._id);
      } catch (error) {
        console.error("Failed to best friend unrequest", error);
        toast({
          title: `Error in accept best friend`,
          description: error instanceof Error ? error.message : "Unknown error",
          className:
            "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
        });
      }
    }
  };
  const handleClick = () => {
    router.push(`/account/${object._id}`);
  };

  return (
    <>
      <Button
        className="flex flex-col shadow-none border-[0.5px] bg-transparent border-light-500 dark:border-dark-200 dark:border-opacity-50 rounded-lg p-3 items-center justify-center w-fit h-fit cursor-pointer hover:border-primary-100 hover:border-opacity-10 hover:bg-primary-100 hover:bg-opacity-10"
        onClick={handleClick}
      >
        <div className="w-[172px] h-[166px] relative overflow-hidden">
          <Image
            src={object.avatar ? object.avatar : "/assets/ava/default.png"}
            alt="ava"
            fill
            className="responsive-friend-vertical object-cover"
          />
        </div>

        <div className="flex flex-col gap-1 w-full h-fit justify-center items-start mt-3">
          <p className="text-dark100_light900 base-medium">
            {object.firstName + " " + object.lastName}
          </p>
          {/* {object.mutualFriends.length > 0 && (
            <p className="text-dark100_light900 body-regular">
              Mutual friends: {object.mutualFriends.length}
            </p>
          )} */}
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
    </>
  );
};

export default VerticalRequestBox;
