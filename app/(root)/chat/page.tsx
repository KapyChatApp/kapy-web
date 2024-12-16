"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/context/ChatContext";
import { isCurrentPageBoxId } from "@/lib/utils";
import { markMessageAsRead } from "@/lib/services/message/read-mark";
import { useUserContext } from "@/context/UserContext";
import { getPusherClient } from "@/lib/pusher";
import { fetchMessageBox } from "@/lib/data/message/dataBox";
import {
  PusherDelete,
  PusherRevoke,
  ResponseMessageDTO
} from "@/lib/DTO/message";
import LeftMessageRaw from "@/components/mess-group/UI-Raw/LeftMessageRaw";
import RightMessageRaw from "@/components/mess-group/UI-Raw/RightMessageRaw";
export interface OnlineEvent {
  userId: string;
  online: boolean;
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isTabVisible, setIsTabVisible] = useState(true);
  const { adminInfo, isOnlineChat } = useUserContext();
  const [noData, setNoData] = useState(false);

  const { dataChat, setDataChat, setReadStatusByBox } = useChatContext();

  // Fetch dataChat
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMessageBox(adminInfo._id, setDataChat, setError);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataChat, adminInfo]);

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
    const adminId = adminInfo._id;

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
    }
  }, [dataChat, handleChatEvent]);

  //Routing
  useEffect(() => {
    if (!loading && dataChat.length === 0) {
      setNoData(true);
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

  if (noData) {
    return (
      <section className="py-[16px] pr-[16px] flex h-screen w-full gap-[16px]">
        <div
          className={`flex flex-row w-full background-light900_dark400 gap-[16px] rounded-[12px]`}
        >
          <div className="flex h-full lg:w-[28%] md:w-[27%] w-[30%]">
            <LeftMessageRaw />
          </div>
          <div className="flex h-full w-full flex-grow bg-transparent">
            <RightMessageRaw />
          </div>
        </div>
      </section>
    );
  }

  return null;
}
