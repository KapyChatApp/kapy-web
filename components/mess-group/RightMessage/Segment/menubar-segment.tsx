"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from "@/components/ui/menubar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useToast } from "@/hooks/use-toast";
import { getPusherClient } from "@/lib/pusher";
import { useChatContext } from "@/context/ChatContext";
import ConfirmRemove from "./ConfirmRemove";
import { PusherDelete, PusherRevoke } from "@/lib/DTO/message";
import { RevokeMessage } from "@/lib/services/message/revoke";
import { DeleteMessage } from "@/lib/services/message/delete";
import { useUserContext } from "@/context/UserContext";
import ReportCard from "@/components/shared/ReportCard";

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
  const {
    setMessagesByBox,
    messagesByBox,
    setFileList,
    fileList,
    isReactedByMessage
  } = useChatContext();
  const { adminInfo } = useUserContext();
  const adminId = adminInfo._id;
  const onclose = () => {
    setConfirm(false);
  };
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
        setConfirm(false);
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
        setConfirm(false);
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
      console.log("Successfully delete message: ", data);
      if (adminId && data.createBy === adminId) {
        // Kiểm tra điều kiện cần thiết
        if (!messagesByBox) {
          console.warn(
            `Box ID ${data.boxId} không tồn tại trong messagesByBox`
          );
          return; // Không thực hiện tiếp nếu boxId không hợp lệ
        }
        const fileDelete = messagesByBox[data.boxId].find(
          (item) => item.id === data.id
        );

        if (fileDelete && fileDelete.contentId) {
          console.log("Updated fileList: ", fileDelete);
          setFileList((prev) => {
            const fileContent = prev[data.boxId] || [];
            return {
              ...prev,
              [data.boxId]: fileContent.filter(
                (msg) => msg.url !== fileDelete.contentId.url
              )
            };
          });
        }
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
      const fileRevoke = messagesByBox[data.boxId].find(
        (item) => item.id === data.id
      );
      if (fileRevoke && fileRevoke.contentId) {
        setFileList((prev) => {
          const fileContent = prev[data.boxId] || [];
          return {
            ...prev,
            [data.boxId]: fileContent.filter(
              (msg) => msg.url !== fileRevoke.contentId.url
            )
          };
        });
      }
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
    if (adminId) {
      pusherClient.bind("delete-message", handleDeleteMessage);
    }
    pusherClient.bind("revoke-message", handleRevokeMessage);

    // Cleanup khi component bị unmount hoặc boxId thay đổi
    // return () => {
    //   pusherClient.unsubscribe(`private-${boxId}`);
    //   pusherClient.unbind("new-message", handleNewMessage);
    // };
  }, [boxId, setMessagesByBox, setFileList, messagesByBox, fileList]);

  return (
    <>
      <div
        className={`flex flex-row gap-2 items-center justify-start w-fit h-full group ${
          isReactedByMessage[messageId] ? "pb-5" : ""
        }`}
      >
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
              className="hover:boder-none ml-[13px] md:min-w-[130px] w-[130px] rounded-lg shadow-lg p-1 dark:bg-dark-200 bg-light-900 gap-2 justify-start items-center group-hover:opacity-100"
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
              <MenubarItem
                onClick={() => {
                  handleItemClick();
                  setAction("report");
                }}
                className="hover:background-light700_dark400 hover:rounded-lg hover:border-none group-hover:opacity-100"
              >
                Report
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
      {isConfirm && action === "report" && (
        <ReportCard onClose={onclose} type="Message" reportedId={messageId} />
      )}
    </>
  );
};

export default MenubarSegment;
