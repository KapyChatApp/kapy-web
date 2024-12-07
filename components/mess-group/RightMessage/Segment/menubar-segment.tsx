"use client";
import React, { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from "@/components/ui/menubar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DeleteMessage, PusherDelete } from "@/lib/delete";
import { useToast } from "@/hooks/use-toast";
import { getPusherClient } from "@/lib/pusher";
import { useChatContext } from "@/context/ChatContext";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import { PusherRevoke, RevokeMessage } from "@/lib/revoke";
import ConfirmRemove from "./ConfirmRemove";

interface MenuProps {
  createAt: string;
  admin?: string;
  messageId: string;
  boxId: string;
}

const MenubarSegment = ({ createAt, admin, messageId, boxId }: MenuProps) => {
  const [isClickMore, setClickMore] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [action, setAction] = useState("");
  const { toast } = useToast();
  const { setMessagesByBox } = useChatContext();

  const handleItemClick = () => {
    setClickMore(false);
    setConfirm(true);
  };

  const handleClick = () => {
    setClickMore(!isClickMore);
  };

  const handleDelete = async () => {
    try {
      // Gọi API delete tin nhắn
      const response = await DeleteMessage(messageId);
      if (response) {
        console.log("Delete success");
        toast({
          title: "Message deleted successfully!",
          className:
            "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
        });
      } else {
        toast({
          title: "Message can't deleted!",
          className:
            "border-none rounded-lg bg-accent-red bg-opacity-20 text-accent-red paragraph-regular items-center justify-center "
        });
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message!");
    }
  };

  const handleRevoke = async () => {
    try {
      // Gọi API delete tin nhắn
      const response = await RevokeMessage(messageId);
      if (response) {
        console.log("Delete success");
        toast({
          title: "Message revoked successfully!",
          className:
            "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
        });
      } else {
        toast({
          title: "Message can't revoke!",
          className:
            "border-none rounded-lg bg-accent-red bg-opacity-20 text-accent-red paragraph-regular items-center justify-center "
        });
      }
    } catch (error) {
      console.error("Failed to revoke message:", error);
      alert("Failed to revoke message!");
    }
  };

  useEffect(() => {
    const handleDeleteMessage = (data: PusherDelete) => {
      const adminId = localStorage.getItem("adminId");
      console.log("Successfully delete message: ", data);
      if (adminId && data.createBy === adminId) {
        setMessagesByBox((prev) => {
          const currentMessages = prev[data.boxId] || [];

          // Kiểm tra xem tin nhắn có id là data.id đã tồn tại hay chưa
          if (currentMessages.some((msg) => msg.id === data.id)) {
            // Nếu có, xóa tin nhắn khỏi danh sách
            return {
              ...prev,
              [data.boxId]: currentMessages.filter((msg) => msg.id !== data.id) // Xóa tin nhắn có id = data.id
            };
          }

          // Nếu không có tin nhắn nào cần xóa, trả về trạng thái cũ
          return prev;
        });
      }
    };
    const handleRevokeMessage = (data: PusherRevoke) => {
      console.log("Successfully reovoke message: ", data);
      setMessagesByBox((prev) => {
        const currentMessages = prev[data.boxId] || [];

        // Cập nhật tin nhắn có id trùng với data.id
        const updatedMessages = currentMessages.map((msg) => {
          if (msg.id === data.id) {
            return {
              ...msg,
              text: data.text,
              flag: data.flag
            };
          }
          return msg; // Giữ nguyên các tin nhắn khác
        });

        return {
          ...prev,
          [data.boxId]: updatedMessages // Cập nhật lại danh sách tin nhắn
        };
      });
    };
    const pusherClient = getPusherClient();
    pusherClient.subscribe(`private-${boxId}`);

    // Bind sự kiện với handler
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
      pusherClient.bind("delete-message", handleDeleteMessage);
    }
    pusherClient.bind("revoke-message", handleRevokeMessage);

    // Cleanup khi component bị unmount hoặc boxId thay đổi
    // return () => {
    //   pusherClient.unsubscribe(`private-${boxId}`);
    //   pusherClient.unbind("new-message", handleNewMessage);
    // };
  }, [boxId, setMessagesByBox]);
  return (
    <>
      <div className="flex flex-row gap-2 items-center justify-start w-fit h-full group">
        {admin && (
          <div className="text-dark100_light900 small-regular flex h-fit w-fit items-center justify-center opacity-0 group-hover:opacity-100 text-nowrap">
            {createAt}
          </div>
        )}
        <Menubar
          className={`transform ${
            isClickMore ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          } transition-opacity shadow-none border-none`}
          onClick={handleClick}
        >
          <MenubarMenu>
            <MenubarTrigger className="shadow-none border-none flex flex-1 items-center justify-between bg-transparent w-full">
              <div className="flex border-none shadow-none rounded-full p-1 hover:bg-light-700 dark:hover:bg-dark-400 hover:bg-opacity-50 dark:hover:bg-opacity-50 w-fit h-fit background-light850_dark200">
                <Icon
                  icon="mingcute:more-2-line"
                  width={16}
                  height={16}
                  className="text-dark100_light900"
                />
              </div>
            </MenubarTrigger>
            <MenubarContent
              side="top"
              align="center"
              className="hover:boder-none ml-[13px] md:min-w-[100px] rounded-lg shadow-lg p-1 dark:bg-dark-200 bg-light-900 gap-2 justify-start items-center group-hover:opacity-100"
            >
              <MenubarItem
                onClick={() => {
                  handleItemClick();
                  setAction("delete");
                }}
                className="hover:background-light700_dark400 hover:rounded-lg hover:border-none group-hover:opacity-100"
              >
                Delete
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  handleItemClick();
                  setAction("revoke");
                }}
                className="hover:background-light700_dark400 hover:rounded-lg hover:border-none group-hover:opacity-100"
              >
                Revoke
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        {!admin && (
          <div className="text-dark100_light900 small-regular flex h-fit w-fit items-center justify-center opacity-0 group-hover:opacity-100 text-nowrap">
            {createAt}
          </div>
        )}
      </div>

      {isConfirm && action === "delete" && (
        <ConfirmRemove
          setConfirm={setConfirm}
          label={action}
          onEvent={handleDelete}
        />
      )}
      {isConfirm && action === "revoke" && (
        <ConfirmRemove
          setConfirm={setConfirm}
          label={action}
          onEvent={handleRevoke}
        />
      )}
    </>
  );
};

export default MenubarSegment;
