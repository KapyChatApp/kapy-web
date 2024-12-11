"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMessageBox } from "@/lib/dataBox";
import { useChatContext } from "@/context/ChatContext";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import { isCurrentPageBoxId } from "@/lib/utils";
import { markMessageAsRead } from "@/lib/read-mark";
import { PusherDelete } from "@/lib/delete";
import { PusherRevoke } from "@/lib/revoke";
import { useUserContext } from "@/context/UserContext";
import { isOnline } from "@/lib/isOnline";
import { isOffline } from "@/lib/isOffline";
import { getPusherClient } from "@/lib/pusher";
export interface OnlineEvent {
  userId: string;
  online: boolean;
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isTabVisible, setIsTabVisible] = useState(true);
  const { setAdminId, isOnlineChat } = useUserContext();

  const { dataChat, setDataChat, setReadStatusByBox } = useChatContext();

  // Fetch dataChat
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMessageBox(setDataChat, setError);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setDataChat]);

  const handleChatEvent = async (
    message: ResponseMessageDTO | PusherRevoke | PusherDelete,
    boxId: string
  ) => {
    if (message) {
      // Cập nhật trạng thái đọc tin nhắn
      if (isCurrentPageBoxId(boxId)) {
        const readMess = await markMessageAsRead(boxId);
        setReadStatusByBox((prevState) => ({
          ...prevState,
          [message.boxId]: readMess
        }));
      } else {
        setReadStatusByBox((prevState) => ({
          ...prevState,
          [message.boxId]: false
        }));
      }
    }
  };

  //LastMessage + UpdatedTime + ReadStatus
  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
      setAdminId(adminId);
    }

    if (dataChat.length > 0) {
      const channels = dataChat.map((box) => {
        const pusherClient = getPusherClient();
        const channel = pusherClient.subscribe(`private-${box.id}`);

        // Đăng ký sự kiện "new-message"
        const handleNewMessage = (newMessage: ResponseMessageDTO) => {
          handleChatEvent(newMessage, box.id);
        };
        channel.bind("new-message", handleNewMessage);

        // Đăng ký sự kiện "delete-message"
        const handleDeleteMessage = (deleteMessage: PusherDelete) => {
          handleChatEvent(deleteMessage, box.id);
        };
        channel.bind("delete-message", handleDeleteMessage);

        // Đăng ký sự kiện "revoke-message"
        const handleRevokeMessage = (revokeMessage: PusherRevoke) => {
          handleChatEvent(revokeMessage, box.id);
        };
        channel.bind("revoke-message", handleRevokeMessage);

        return {
          channel,
          handleNewMessage,
          handleDeleteMessage,
          handleRevokeMessage
        };
      });

      // Đặt interval để cập nhật thời gian
      // const interval = setInterval(() => {
      //   setLatestMessages((prevMessages) => {
      //     const updatedMessages = { ...prevMessages };
      //     Object.keys(updatedMessages).forEach((boxId) => {
      //       const message = updatedMessages[boxId];
      //       const formattedTime =
      //         createAt === "1min"
      //           ? createAt
      //           : formatTimeMessageBox(message.createAt);

      //       updatedMessages[boxId] = {
      //         ...message,
      //         createAt: formattedTime
      //       };
      //     });
      //     return updatedMessages;
      //   });
      // }, 60000);
    }
  }, [dataChat, handleChatEvent]);

  //Routing
  useEffect(() => {
    if (!loading && dataChat.length === 0) {
      console.warn("No detail in messChat.");
      return;
    }

    if (!loading && dataChat.length > 0) {
      router.push(`/chat/${dataChat[0].id}`);
    }
  }, [loading, dataChat, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
}
