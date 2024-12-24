"use client";
import RightMessage from "@/components/mess-group/RightMessage/RightMessage";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { fetchMessageBox } from "@/lib/data/message/dataBox";
import { MessageBoxInfo } from "@/lib/DTO/message";
import RightMessageRaw from "@/components/mess-group/UI-Raw/RightMessageRaw";
import { useChatContext } from "@/context/ChatContext";

const MessageContent = () => {
  const [error, setError] = useState("");
  const pathname = usePathname();
  const isGroup = pathname.startsWith("/group-chat/");
  const [dataChat, setDataChat] = useState<MessageBoxInfo[]>([]);
  const { id } = useParams();
  const router = useRouter();
  const { setReadStatusByBox, setReadedIdByBox } = useChatContext();

  //Fetch and router to Id
  useEffect(() => {
    const fetchChats = async () => {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) return;
      try {
        const data: MessageBoxInfo[] = await fetchMessageBox(adminId, setError);
        setDataChat(data);

        for (const box of data) {
          setReadStatusByBox((prevState) => ({
            ...prevState,
            [box.id]: box.readStatus
          }));
          setReadedIdByBox((prevState) => ({
            ...prevState,
            [box.id]: box.readedId
          }));
        }
        if (!id && data.length > 0) {
          router.push(`/${data[0].id}`);
        } else if (data.length === 0) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    fetchChats();
  }, [id, router]);

  if (!dataChat) {
    return (
      <div className="flex h-screen w-screen items-center justify-center background-light900-dark400">
        <div className="loader"></div>
      </div>
    );
  }
  if (!dataChat.length) {
    return <RightMessageRaw />;
  }
  const chatItem = dataChat.find((chat) => chat.id === id);

  return <RightMessage chatItem={chatItem} />;
};

export default MessageContent;
