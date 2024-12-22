"use client";
import RightMessage from "@/components/mess-group/RightMessage/RightMessage";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { fetchMessageBox } from "@/lib/data/message/dataBox";
import { MessageBoxInfo } from "@/lib/DTO/message";

const MessageContent = () => {
  const [error, setError] = useState("");

  const [dataChat, setDataChat] = useState<MessageBoxInfo[]>([]);
  const { id } = useParams();
  const router = useRouter();

  //Fetch and router to Id
  useEffect(() => {
    const fetchChats = async () => {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) return;
      try {
        const data: MessageBoxInfo[] = await fetchMessageBox(adminId, setError);
        console.log("API data:", data);
        setDataChat(data);

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
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }
  const chatItem = dataChat.find((chat) => chat.id === id);

  return <RightMessage chatItem={chatItem} />;
};

export default MessageContent;
