"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMessageBox } from "@/lib/dataBox";
import { LatestMessage, useChatContext } from "@/context/ChatContext";
import { getPusherClient } from "@/lib/pusher";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import {
  contentBox,
  formatTimeMessageBox,
  isCurrentPageBoxId
} from "@/lib/utils";
import { markMessageAsRead } from "@/lib/read-mark";
import { PusherDelete } from "@/lib/delete";
import { PusherRevoke } from "@/lib/revoke";
import { useUserContext } from "@/context/UserContext";
import { isOnline } from "@/lib/isOnline";
import { isOffline } from "@/lib/isOffline";
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

  const checkOnlineStatus = async (token: string) => {
    try {
      const result = await isOnline(token); // Gọi API kiểm tra trạng thái online
      console.log("User online status:", result);
      // Xử lý kết quả từ API
    } catch (error) {
      console.error("Error checking online status:", error);
    }
  };
  // API để gọi trạng thái offline
  const setOfflineStatus = async (token: string) => {
    try {
      await isOffline(token); // Gọi API để cập nhật trạng thái offline
      console.log("User is offline");
    } catch (error) {
      console.error("Error setting offline status:", error);
    }
  };

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
