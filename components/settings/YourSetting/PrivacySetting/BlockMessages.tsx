"use client";
import ConfirmModal, {
  ConfirmModalProps
} from "@/components/friends/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useFriendContext } from "@/context/FriendContext";
import { useUserContext } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import {
  FindUserDTO,
  FriendRequestDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";
import { unBlockFr } from "@/lib/services/friend/unblock";
import Image from "next/image";
import React, { useState } from "react";

interface BlockMessagesProps {
  block: FriendResponseDTO | RequestedResponseDTO | FindUserDTO;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
}

const BlockMessages = ({ block, setIndex }: BlockMessagesProps) => {
  const { adminInfo } = useUserContext();
  const { setListFriend } = useFriendContext();

  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });
  const handleUnblock = async () => {
    try {
      const friendRequest: FriendRequestDTO = {
        sender: adminInfo._id,
        receiver: block._id
      };
      const result = await unBlockFr(friendRequest, setListFriend);
      setIndex(block._id);
      toast({
        title: `Unblock successfully`,
        description: `You and ${
          block.firstName + " " + block.lastName
        } are friend again`,
        className:
          "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
      });
    } catch (error) {
      console.error("Failed to unblock", error);
      toast({
        title: `Error in unblock`,
        description: error instanceof Error ? error.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };

  const confirmHandleUnBlock = async () => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: handleUnblock,
      name: block.firstName + " " + block.lastName,
      action: "unblock"
    });
  };
  return (
    <>
      <div className="flex flex-row justify-between items-center w-full h-fit pl-2">
        <div className="flex flex-row justify-between items-center w-full h-fit">
          <div className="flex flex-row h-fit w-fit gap-3 items-center justify-start">
            <Image
              src={block.avatar ? block.avatar : "/assets/ava/default.png"}
              alt="ava"
              width={36}
              height={36}
              className="rounded-full"
            />
            <p className="text-dark100_light900 body-regular">
              {block.firstName + " " + block.lastName}
            </p>
          </div>

          <Button
            className="flex border border-accent-red text-accent-red shadow-none bg-transparent hover:bg-accent-red hover:bg-opacity-20 hover:border-accent-red hover:border-opacity-0  body-regular rounded-lg px-3 py-[10px]"
            onClick={confirmHandleUnBlock}
          >
            Unblock
          </Button>
        </div>
      </div>

      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default BlockMessages;
