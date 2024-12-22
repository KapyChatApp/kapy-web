"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  FriendRequestDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";
import { OtherBoxButtonProps } from "./FriendBox";
import { useFriendContext } from "@/context/FriendContext";
import ConfirmModal, { ConfirmModalProps } from "./ConfirmModal";
import { useUserContext } from "@/context/UserContext";
import { unBestFriend } from "@/lib/services/friend/unBff";
import { toast } from "@/hooks/use-toast";
import { unFriend } from "@/lib/services/friend/unfriend";
import { blockFriend } from "@/lib/services/friend/block";
import { handleMessage } from "@/lib/utils";
import { useChatContext } from "@/context/ChatContext";
import { useRouter } from "next/navigation";
import { findBoxChat } from "@/lib/services/message/findBoxChat";
import { RequestCreateGroup } from "@/lib/DTO/message";

interface OtherButton {
  account: FriendResponseDTO | RequestedResponseDTO;
  other: OtherBoxButtonProps;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
}

const OtherBoxButton: React.FC<OtherButton> = ({
  account,
  other,
  setIndex
}) => {
  const info = account;
  const { icon, label, value } = other;
  const { adminInfo } = useUserContext();
  const { setListFriend } = useFriendContext();
  const { dataChat, setDataChat } = useChatContext();
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRouteMessage = async () => {
    const response = await findBoxChat(info._id);
    if (!response) {
      const param: RequestCreateGroup = {
        membersIds: [info._id],
        groupName: ""
      };
      //param, groupAva, setDataChat, setError
      handleMessage(param, undefined, setDataChat, setError, router);
    } else {
      router.push(`/${response}`);
    }
  };

  const handleUnfriend = async () => {
    try {
      const friendRequest: FriendRequestDTO = {
        sender: info._id,
        receiver: adminInfo._id
      };
      const result = await unFriend(friendRequest, setListFriend);
      setIndex(info._id);
      toast({
        title: `Unfriend successfully`,
        description: `You and ${
          info.firstName + " " + info.lastName
        } are not friend`,
        className:
          "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
      });
    } catch (error) {
      console.error("Failed to unfriend", error);
      toast({
        title: `Error in unfriend`,
        description: error instanceof Error ? error.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };
  const handleBlockFriend = async () => {
    try {
      const friendRequest: FriendRequestDTO = {
        sender: adminInfo._id,
        receiver: info._id
      };
      const result = await blockFriend(friendRequest, setListFriend);
      setIndex(info._id);
      toast({
        title: `Block Successfully`,
        description: `You blocked ${info.firstName + " " + info.lastName}`,
        className:
          "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
      });
    } catch (error) {
      console.error("Failed to block friend", error);
      toast({
        title: `Error in blocking friend`,
        description: error instanceof Error ? error.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };

  const handleButton = () => {
    switch (value) {
      case "unfriend":
        setIsConfirm(true);
        setConfirm({
          setConfirm: setIsConfirm,
          handleAction: handleUnfriend,
          name: info.firstName + " " + info.lastName,
          action: value
        });
        break;
      case "block":
        setIsConfirm(true);
        setConfirm({
          setConfirm: setIsConfirm,
          handleAction: handleBlockFriend,
          name: info.firstName + " " + info.lastName,
          action: value
        });
        break;
      default:
        console.log("hello");
        handleRouteMessage();
        break;
    }
  };

  return (
    <>
      <div className="flex w-full h-fit">
        <Button
          className="flex flex-row w-full py-2 px-3 gap-3 shadow-none border-none hover:background-light700_dark400 rounded-lg justify-start items-end"
          onClick={handleButton}
        >
          <Icon
            icon={icon}
            width={20}
            height={20}
            className="text-dark100_light900"
          />
          <p className="text-dark100_light900 paragraph-regular">{label}</p>
        </Button>
      </div>
      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default OtherBoxButton;
