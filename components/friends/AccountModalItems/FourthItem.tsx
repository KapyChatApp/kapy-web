"use client";
import { Switch } from "@/components/ui/switch";
import { useFriendContext } from "@/context/FriendContext";
import { toast } from "@/hooks/use-toast";
import { FriendProfileResponseDTO, FriendRequestDTO } from "@/lib/DTO/friend";
import { blockFriend } from "@/lib/services/friend/block";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import ConfirmModal, { ConfirmModalProps } from "../ConfirmModal";
import Image from "next/image";

interface FourthItemProps {
  user: FriendProfileResponseDTO;
}

const FourthItem = ({ user }: FourthItemProps) => {
  const [adminId, setAdminId] = useState("");
  const [relation, setRelation] = useState(user.relation);
  const { setListFriend } = useFriendContext();
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });
  useEffect(() => {
    const id = localStorage.getItem("adminId");
    if (id) setAdminId(id);
  }, []);
  const handleBlockFriend = async () => {
    try {
      const friendRequest: FriendRequestDTO = {
        sender: adminId,
        receiver: user._id
      };
      const result = await blockFriend(friendRequest, setListFriend);
      setRelation("block");
      toast({
        title: `Block Successfully`,
        description: `You blocked ${user.firstName + " " + user.lastName}`,
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

  const handleConfirmBlock = () => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: handleBlockFriend,
      name: user.firstName + " " + user.lastName,
      action: "block"
    });
  };
  return (
    <>
      <div className="flex flex-col items-start justify-start gap-4 w-full h-fit">
        <div className="flex flex-col w-full h-fit justify-start items-start gap-2">
          <div className="flex flex-row items-center justify-start h-fit w-full gap-2">
            <p className="text-dark100_light900 paragraph-15-regular">
              Mutual friends
            </p>
            <p className="text-dark100_light900 paragraph-15-light">
              ({user.mutualFriends.length})
            </p>
          </div>

          <div className="flex flex-col gap-1 w-full h-fit justify-start">
            {user.mutualFriends.map((item) => (
              <div className="flex flex-row gap-2 w-full h-fit justify-start items-center">
                <Image
                  alt=""
                  src={item.avatar ? item.avatar : "/assets/ava/default.png"}
                  width={40}
                  height={40}
                  className="rounded-full cursor-pointer"
                />
                <p className="text-dark100_light900 body-regular">
                  {item.firstName + " " + item.lastName}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center justify-between h-fit w-full">
          <div className="flex flex-row gap-3 w-fit h-fit items-center">
            <Icon
              icon="mdi:user-block"
              width={18}
              height={18}
              className="text-dark100_light900"
            />
            <p className="text-dark100_light900 paragraph-15-regular">
              Block message and friend
            </p>
          </div>

          <div className="flex h-fit w-fit">
            <Switch
              id="block-mode"
              checked={relation === "block"}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleConfirmBlock();
                } else {
                  setRelation("");
                }
              }}
              disabled={relation === "block"}
            />
          </div>
        </div>
      </div>
      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default FourthItem;
