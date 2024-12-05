"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMessageBox } from "@/lib/dataBox";
import { LatestMessage, useChatContext } from "@/context/ChatContext";
import { getPusherClient } from "@/lib/pusher";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import { formatTimeMessageBox, isCurrentPageBoxId } from "@/lib/utils";
import { markMessageAsRead } from "@/lib/read-mark";
import { PusherDelete } from "@/lib/delete";
import { PusherRevoke } from "@/lib/revoke";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [adminId, setAdminId] = useState("");

  const {
    dataChat,
    messagesByBox,
    setDataChat,
    setReadStatusByBox,
    setLatestMessages
  } = useChatContext();

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
  let content = "";
  let senderName = "";
  let createAt = "";
  const handleChatEvent = async (
    event: "new-message" | "delete-message" | "revoke-message",
    message: ResponseMessageDTO | PusherRevoke | PusherDelete,
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

      // Xác định tên người gửi
      if (adminId) {
        senderName = message.createBy === adminId ? "You:" : "";
      }

      // Lấy nội dung tin nhắn
      if (event === "new-message") {
        if (!message.text && "contentId" in message) {
          const fileContent = message.contentId;
          content =
            fileContent.type === "Image"
              ? "Sent a photo"
              : fileContent.type === "Video"
              ? "Sent a video"
              : fileContent.type === "Audio"
              ? "Sent an audio"
              : fileContent.type === "Other"
              ? "Sent a file"
              : "Unknown content type";
        } else if (message.text) {
          content = message.text; // Nội dung tin nhắn văn bản
        } else {
          content = "Unknown message content";
        }
      } else if (event === "delete-message") {
        if (message.createBy === adminId) {
          content = message.text;
        } else {
          content = box ? box.content : "";
        }
      } else content = message.text;

      // Định dạng thời gian
      const now = new Date();
      const sendDate = new Date(message.createAt);
      const timeDifference = now.getTime() - sendDate.getTime();
      if (timeDifference < 60000) {
        createAt = "1min";
      } else {
        createAt = formatTimeMessageBox(message.createAt); // Lưu thời gian gốc nếu khác 1 phút
      }
    }

    // Cập nhật tin nhắn cuối cùng
    const lastMessage: LatestMessage = {
      senderName,
      content,
      createAt,
      boxId: message.boxId
    };
    console.log({ event, message, content });
    setLatestMessages((prevMessages) => ({
      ...prevMessages,
      [message.boxId]: lastMessage
    }));
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
        const handleNewMessage = async (newMessage: ResponseMessageDTO) => {
          await handleChatEvent("new-message", newMessage, box.id);
        };
        channel.bind("new-message", handleNewMessage);

        // Đăng ký sự kiện "delete-message"
        const handleDeleteMessage = async (deleteMessage: PusherDelete) => {
          await handleChatEvent("delete-message", deleteMessage, box.id);
        };
        channel.bind("delete-message", handleDeleteMessage);

        // Đăng ký sự kiện "revoke-message"
        const handleRevokeMessage = async (revokeMessage: PusherRevoke) => {
          await handleChatEvent("revoke-message", revokeMessage, box.id);
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
      console.log(createAt);
      const interval = setInterval(() => {
        setLatestMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };
          Object.keys(updatedMessages).forEach((boxId) => {
            const message = updatedMessages[boxId];
            const formattedTime =
              createAt === "1min"
                ? createAt
                : formatTimeMessageBox(message.createAt);

            updatedMessages[boxId] = {
              ...message,
              createAt: formattedTime
            };
          });
          return updatedMessages;
        });
      }, 60000); // Cập nhật mỗi phút

      // Cleanup function
      // return () => {
      //   channels.forEach(
      //     ({
      //       channel,
      //       handleNewMessage,
      //       handleDeleteMessage,
      //       handleRevokeMessage
      //     }) => {
      //       // Hủy đăng ký sự kiện
      //       channel.unbind("new-message", handleNewMessage);
      //       channel.unbind("delete-message", handleDeleteMessage);
      //       channel.unbind("revoke-message", handleRevokeMessage);

      //       // Hủy đăng ký kênh
      //       channel.unsubscribe();
      //     }
      //   );

      //   // Hủy interval
      //   clearInterval(interval);
      // };
    }
  }, [dataChat, handleChatEvent, setLatestMessages]);

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
