"use client";
import ConfirmModal, {
  ConfirmModalProps
} from "@/components/friends/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useFriendContext } from "@/context/FriendContext";
import { toast } from "@/hooks/use-toast";
import { FriendRequestDTO } from "@/lib/DTO/friend";
import { blockFriend } from "@/lib/services/friend/block";
import { unBlockFr } from "@/lib/services/friend/unblock";
import { handleAddBff } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Actions {
  icon: string;
  label: string;
  click: string;
}
interface ActionButtonProps {
  action: Actions;
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
  relation?: string;
  setRelation?: React.Dispatch<React.SetStateAction<string>>;
  userId?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  setActiveComponent,
  relation,
  setRelation,
  userId
}) => {
  const pathname = usePathname();
  const isGroup = /^\/group-chat/.test(pathname);
  const { setListBlockedFriend, setListFriend } = useFriendContext();

  const { icon, label, click } = action;

  const [isNotified, setIsNotified] = useState(false);
  const [isFind, setIsFind] = useState(false);
  const [isBest, setIsBest] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isManage, setIsManage] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });

  useEffect(() => {
    if (relation && relation === "bff") {
      if (click === "best") {
        setIsBest(true);
      }
    } else if (relation === "blocked" || relation === "blockedBy") {
      if (click === "block") {
        setIsBlock(true);
      }
    }
  }, [relation, click]);

  const handleUnBlockChat = async () => {
    try {
      const adminId = localStorage.getItem("adminId");

      // Kiểm tra xem receiverId và senderId có tồn tại hay không
      if (!userId || !adminId) {
        alert("Lỗi: Không có ID người nhận hoặc người gửi.");
        return;
      }

      // Tạo đối tượng params theo kiểu FriendRequestDTO
      const params: FriendRequestDTO = {
        sender: adminId ? adminId : "",
        receiver: userId ? userId : ""
      };

      await unBlockFr(params, setListBlockedFriend);
      setIsBlock(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockFriend = async () => {
    try {
      const adminId = localStorage.getItem("adminId");

      // Kiểm tra xem receiverId và senderId có tồn tại hay không
      if (!userId || !adminId) {
        console.log();
        alert("Lỗi: Không có ID người nhận hoặc người gửi.");
        return;
      }
      const friendRequest: FriendRequestDTO = {
        sender: adminId,
        receiver: userId
      };
      const result = await blockFriend(friendRequest, setListFriend);
      setIsBlock(true);
      toast({
        title: `Block Successfully`,
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

  const handleConfirmBlock = async () => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: handleBlockFriend,
      name: "this user",
      action: "block"
    });
  };

  const handleConfirmUnBlock = async () => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: handleUnBlockChat,
      name: "this user",
      action: "unblock"
    });
  };

  const handleButton = () => {
    switch (click) {
      case "notified":
        setIsNotified((prev) => !prev);
        break;
      case "find":
        setIsFind((prev) => !prev);
        setActiveComponent(click);
        break;
      case "block":
        if (isBlock) {
          handleConfirmUnBlock();
        } else {
          handleConfirmBlock();
        }
        break;
      case "best":
        setIsBest((prev) => prev);
        break;
      case "add":
        setIsAdd((prev) => !prev);
        setActiveComponent(click);
        break;
      case "manage":
        setIsManage((prev) => !prev);
        setActiveComponent(click);
        break;
    }
  };

  const displayLabel = isNotified ? "Turn on" : isBlock ? "Unblock" : label;
  const displayIcon = isNotified ? "mingcute:notification-off-fill" : icon;

  return (
    <>
      <div
        // className={`${
        //   isGroup ? "xl:min-w-[60px] w-fit" : "lg:min-w-[60px] w-[57px]"
        // } flex flex-col items-center justify-center gap-[8px]`}
        className={`w-fit flex flex-col items-center justify-center gap-[8px]`}
      >
        <Button className="flex items-center justify-center w-fit shadow-none hover:shadow-none focus:shadow-none outline-none border-none p-0">
          <div
            className={`flex flex-col items-center justify-center rounded-full p-[6px] ${
              isBest
                ? "bg-primary-500 bg-opacity-20"
                : isBlock
                ? "bg-accent-red bg-opacity-20"
                : "bg-light-700 dark:bg-dark-400 dar:bg-opacity-80"
            }`}
            onClick={handleButton}
          >
            <Icon
              icon={displayIcon}
              width={24}
              height={24}
              className={`${
                isBest
                  ? "text-primary-500"
                  : isBlock
                  ? "text-accent-red"
                  : "text-dark100_light900"
              } `}
            />
          </div>
        </Button>
        <p
          className={`${
            isBest
              ? "text-primary-500 small-regular"
              : isBlock
              ? "text-accent-red small-regular"
              : "text-dark100_light900 small-regular"
          }`}
        >
          {displayLabel}
        </p>
      </div>
      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default ActionButton;
