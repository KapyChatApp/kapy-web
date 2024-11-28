"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMessageBox } from "@/lib/dataBox";
import { LatestMessage, useChatContext } from "@/context/ChatContext";
import { getPusherClient } from "@/lib/pusher";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import { file } from "@/constants/media";
import { formatTimeMessageBox, isCurrentPageBoxId } from "@/lib/utils";
import { markMessageAsRead } from "@/lib/read-mark";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const {
    dataChat,
    setDataChat,
    detailByBox,
    setReadStatusByBox,
    readStatusByBox,
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

  //LastMessage + UpdatedTime + ReadStatus
  const adminId = localStorage.getItem("adminId");
  useEffect(() => {
    if (dataChat.length > 0) {
      const channels = dataChat.map((box) => {
        const pusherClient = getPusherClient();
        const channel = pusherClient.subscribe(`private-${box.id}`);

        channel.bind("new-message", async (newMessage: ResponseMessageDTO) => {
          console.log(`New message for box ${box.id}:`, newMessage);
          let content: string = "";
          let senderName: string = "";
          let createAt: string = "";

          if (newMessage) {
            if (isCurrentPageBoxId(box.id)) {
              const readMess = await markMessageAsRead(box.id);
              setReadStatusByBox((prevState) => ({
                ...prevState,
                [newMessage.boxId]: readMess
              }));
            } else {
              setReadStatusByBox((prevState) => ({
                ...prevState,
                [newMessage.boxId]: false
              }));
            }
            if (adminId) {
              senderName = newMessage.createBy === adminId ? "You:" : "";
            }

            if (
              newMessage.contentId.length > 0 &&
              newMessage.text.length === 0
            ) {
              let detailContent: string = "";
              const fileContent =
                newMessage.contentId[newMessage.contentId.length - 1];
              detailContent =
                fileContent.type === "Image"
                  ? "Sent a photo"
                  : fileContent.type === "Video"
                  ? "Sent a video"
                  : fileContent.type === "Audio"
                  ? "Sent an audio"
                  : fileContent.type === "Other"
                  ? "Sent a file"
                  : "";
              content = detailContent;
            } else {
              content = newMessage.text[newMessage.text.length - 1];
            }

            const now = new Date();
            const sendDate = new Date(newMessage.createAt);
            const timeDifference = now.getTime() - sendDate.getTime();
            console.log(timeDifference);
            if (timeDifference < 60000) {
              createAt = "1min";
            } else {
              createAt = newMessage.createAt; // Lưu thời gian gốc nếu khác 1 phút
            }
          }

          const lastMessage: LatestMessage = {
            senderName: senderName,
            content: content,
            createAt: createAt, // Lưu thời gian gốc ở dạng ISO
            boxId: newMessage.boxId
          };

          setLatestMessages((prevMessages) => ({
            ...prevMessages,
            [newMessage.boxId]: lastMessage
          }));
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
  }, [dataChat, detailByBox, setReadStatusByBox, readStatusByBox]);

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
