"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Sử dụng useRouter để điều hướng
import { fetchMessageBoxGroup } from "@/lib/dataBoxGroup";
import { LatestMessage, useChatContext } from "@/context/ChatContext";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import { formatTimeMessageBox, isCurrentPageBoxId } from "@/lib/utils";
import { DetailBox, fetchDetailBox } from "@/lib/dataOneBox";
import { markMessageAsRead } from "@/lib/read-mark";
import { getPusherClient } from "@/lib/pusher";
import { PusherDelete } from "@/lib/delete";
import { PusherRevoke } from "@/lib/revoke";
import { admin } from "@/constants/object";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [adminId, setAdminId] = useState("");

  const { dataChat, setDataChat, setReadStatusByBox } = useChatContext();

  //Fetch dataChat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchMessageBoxGroup(setDataChat, setError);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleChatEvent = async (
    message: ResponseMessageDTO | PusherDelete | PusherRevoke,
    boxId: string
  ) => {
    const box = dataChat.find((chat) => chat.id === boxId);

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

        const handleNewMessage = async (newMessage: ResponseMessageDTO) => {
          await handleChatEvent(newMessage, box.id);
        };
        channel.bind("new-message", handleNewMessage);

        // Đăng ký sự kiện "delete-message"
        const handleDeleteMessage = async (deleteMessage: PusherDelete) => {
          await handleChatEvent(deleteMessage, box.id);
        };
        channel.bind("delete-message", handleDeleteMessage);

        // Đăng ký sự kiện "revoke-message"
        const handleRevokeMessage = async (revokeMessage: PusherRevoke) => {
          await handleChatEvent(revokeMessage, box.id);
        };
        channel.bind("revoke-message", handleRevokeMessage);

        return {
          channel,
          handleNewMessage,
          handleDeleteMessage,
          handleRevokeMessage
        };
      });

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
      //         createAt: formattedTime // Chỉ cập nhật nếu định dạng thay đổi
      //       };
      //     });
      //     return updatedMessages;
      //   });
      // }, 60000); // Chạy mỗi phút
    }
  }, [dataChat, setReadStatusByBox]);

  //Routing
  useEffect(() => {
    if (!loading && dataChat.length === 0) {
      console.warn("Không có tin nhắn trong groupChat.");
      return;
    }

    if (!loading && dataChat.length > 0) {
      router.push(`/group-chat/${dataChat[0].id}`);
    }
  }, [loading, dataChat, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
}
