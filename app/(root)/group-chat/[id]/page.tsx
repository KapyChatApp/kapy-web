"use client";
import RightMessage from "@/components/mess-group/RightMessage/RightMessage";
import { useEffect, useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { fetchMessageBox } from "@/lib/data/message/dataBox";
import { MessageBoxInfo } from "@/lib/DTO/message";
import { fetchMessageBoxGroup } from "@/lib/data/message/dataBoxGroup";
import RightMessageRaw from "@/components/mess-group/UI-Raw/RightMessageRaw";

const GroupMessContent = () => {
  const [error, setError] = useState("");

  const [dataChat, setDataChat] = useState<MessageBoxInfo[]>([]);
  const { setReadStatusByBox, setReadedIdByBox } = useChatContext();
  const { id } = useParams();
  const router = useRouter();

  //Fetch and router to Id
  useEffect(() => {
    const fetchChats = async () => {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) return;
      try {
        const data: MessageBoxInfo[] = await fetchMessageBoxGroup(setError);
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
        // Sử dụng trực tiếp `data` thay vì `dataChat`
        if (!id && data.length > 0) {
          router.push(`/group-chat/${data[0].id}`); // Điều hướng sang chat đầu tiên
        } else if (data.length === 0) {
          // Nếu không có chat nào, điều hướng về trang chính
          router.push("/group-chat");
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };

    fetchChats();
  }, [id, router, setDataChat]);

  if (!dataChat) {
    return (
      <div className="flex h-screen w-screen items-center justify-center background-light900_dark400">
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

export default GroupMessContent;
