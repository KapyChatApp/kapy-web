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

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
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
            if (adminId) {
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
              if (newMessage.createBy === adminId) {
                senderName = "You:";
              }
              if (detailByBox && detailByBox[box.id]) {
                const receiverInfo = detailByBox[box.id].receiverIds;
                if (receiverInfo.length > 0) {
                  receiverInfo.forEach((item) => {
                    if (item.id === newMessage.createBy) {
                      senderName = item.firstName + " " + item.lastName;
                    }
                  });
                }
              }
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
