"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { deleteMessageBox } from "@/lib/services/message/deleteBox";
import ConfirmModal, {
  ConfirmModalProps
} from "@/components/friends/ConfirmModal";
import { toast } from "@/hooks/use-toast";
import { unFriend } from "@/lib/services/friend/unfriend";
import { FriendRequestDTO } from "@/lib/DTO/friend";
import { useFriendContext } from "@/context/FriendContext";
import { UserInfoBox } from "@/lib/DTO/message";

const MoreBottom: React.FC<{
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
  receiver: UserInfoBox;
  boxId: string;
}> = ({ receiver, setActiveComponent, boxId }) => {
  const [stButton, setFirst] = useState(false);
  const [ndButton, setSecond] = useState(false);
  const { setListFriend } = useFriendContext();
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });

  const handleDeleteChat = async (boxId: string) => {
    try {
      const isDeleted = await deleteMessageBox(boxId);

      if (isDeleted) {
        console.log("Message box deleted successfully");
      } else {
        console.warn("Failed to delete message box");
      }
    } catch (error) {
      console.warn("An error occurred while deleting the message box:", error);
    }
  };

  const handleUnfriend = async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      const friendRequest: FriendRequestDTO = {
        sender: receiver._id,
        receiver: adminId || ""
      };
      const result = await unFriend(friendRequest, setListFriend);
      toast({
        title: `Unfriend successfully`,
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

  const handleLeaveGroup = async () => {};
  const handleFirstButton = () => {
    setFirst(!stButton);
    setConfirm({
      setConfirm: setFirst,
      handleAction: () => handleDeleteChat(boxId),
      name: receiver.firstName + " " + receiver.lastName,
      action: "remove"
    });
  };

  const handleSecondButton = () => {
    setSecond(!ndButton);
    isGroup
      ? setConfirm({
          setConfirm: setFirst,
          handleAction: handleLeaveGroup,
          name: "group",
          action: "leave"
        })
      : setConfirm({
          setConfirm: setFirst,
          handleAction: handleUnfriend,
          name: receiver.firstName + " " + receiver.lastName,
          action: "unfriend"
        });
  };

  const pathname = usePathname();
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);
  const displayLabelButton = isGroup ? "Leave Group" : "Unfriend";
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-[8px] w-full mt-auto responsive-moreAction">
        <div className="flex items-center justify-center gap-[8px] w-full rounded-lg bg-light-700 dark:bg-dark-400 dark:bg-opacity-80">
          <Button
            className="shadow-none border-none flex items-center justify-center w-full bg-transparent"
            onClick={handleFirstButton}
          >
            <p className="text-dark100_light900  paragraph-semibold">Remove</p>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-[8px] w-full rounded-lg bg-accent-red bg-opacity-20">
          <Button
            className="shadow-none border-none flex items-center justify-center w-full bg-transparent"
            onClick={handleSecondButton}
          >
            <p className="text-accent-red paragraph-semibold">
              {displayLabelButton}
            </p>
          </Button>
        </div>
      </div>

      {stButton && <ConfirmModal confirm={confirm} />}

      {ndButton && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default MoreBottom;
