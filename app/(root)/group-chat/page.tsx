"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/context/ChatContext";
import { isCurrentPageBoxId } from "@/lib/utils";
import { markMessageAsRead } from "@/lib/services/message/read-mark";
import { getPusherClient } from "@/lib/pusher";
import {
  PusherDelete,
  PusherRevoke,
  ResponseMessageDTO
} from "@/lib/DTO/message";
import { fetchMessageBoxGroup } from "@/lib/data/message/dataBoxGroup";
import { useUserContext } from "@/context/UserContext";
import LeftMessageRaw from "@/components/mess-group/UI-Raw/LeftMessageRaw";
import RightMessageRaw from "@/components/mess-group/UI-Raw/RightMessageRaw";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { adminInfo } = useUserContext();
  const { dataChat, setDataChat, setReadStatusByBox } = useChatContext();
  const [noData, setNoData] = useState(false);

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
    const adminId = adminInfo._id;
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
    }
  }, [dataChat, setReadStatusByBox]);

  //Routing
  useEffect(() => {
    if (!loading && dataChat.length === 0) {
      setNoData(true);
      console.warn("No message in groupChat.");
      return;
    }

    if (!loading && dataChat.length > 0) {
      router.push(`/group-chat/${dataChat[0].id}`);
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
