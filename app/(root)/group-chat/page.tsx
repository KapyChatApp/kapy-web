"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Sử dụng useRouter để điều hướng
import { fetchMessageBoxGroup } from "@/lib/dataBoxGroup";
import { MessageBoxContent } from "@/lib/dataBox";
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

  const {
    dataChat,
    setDataChat,
    setLatestMessages,
    detailByBox,
    setDetailByBox,
    setReadStatusByBox
  } = useChatContext();

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
    event: "new-message" | "delete-message" | "revoke-message",
    message: ResponseMessageDTO | PusherDelete | PusherRevoke,
    boxId: string
  ) => {
    let content = "";
    let senderName = "";
    let createAt = "";

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
        if (message.createBy === adminId) {
          senderName = "You:";
        }
        if (detailByBox && detailByBox[boxId]) {
          const receiverInfo = detailByBox[boxId].receiverIds;
          if (receiverInfo.length > 0) {
            receiverInfo.forEach((item) => {
              if (item.id === message.createBy) {
                senderName = item.firstName + " " + item.lastName;
              }
            });
          }
        }
      }

      // Lấy nội dung tin nhắn
      if (event === "new-message" && "contentId" in message && !message.text) {
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
            : "";
      } else {
        if (event === "revoke-message") {
          content = "Revoked message.";
        }
      }

      // Định dạng thời gian
      const now = new Date();
      const sendDate = new Date(message.createAt.toString());
      const timeDifference = now.getTime() - sendDate.getTime();
      createAt =
        timeDifference < 60000
          ? "1min"
          : formatTimeMessageBox(message.createAt.toString());
    }

    // Cập nhật tin nhắn cuối cùng
    const lastMessage: LatestMessage = {
      senderName,
      content,
      createAt,
      boxId: message.boxId
    };

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

        channel.bind("new-message", async (newMessage: ResponseMessageDTO) => {
          await handleChatEvent("new-message", newMessage, box.id);
        });

        channel.bind("delete-message", async (deleteMessage: PusherDelete) => {
          await handleChatEvent("delete-message", deleteMessage, box.id);
        });

        channel.bind("revoke-message", async (revokeMessage: PusherRevoke) => {
          await handleChatEvent("revoke-message", revokeMessage, box.id);
        });

        return channel;
      });

      const interval = setInterval(() => {
        setLatestMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };
          Object.keys(updatedMessages).forEach((boxId) => {
            const message = updatedMessages[boxId];
            const formattedTime =
              message.createAt === "1min"
                ? message.createAt
                : formatTimeMessageBox(message.createAt);

            updatedMessages[boxId] = {
              ...message,
              createAt: formattedTime // Chỉ cập nhật nếu định dạng thay đổi
            };
          });
          return updatedMessages;
        });
      }, 60000); // Chạy mỗi phút
    }
  }, [dataChat, detailByBox, setLatestMessages, setReadStatusByBox]);

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
    return <div>Loading...</div>; // Hiển thị loading khi đang xử lý
  }

  return null; // Không hiển thị giao diện sau khi điều hướng
}
