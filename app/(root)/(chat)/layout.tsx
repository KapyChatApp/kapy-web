// app/message/layout.tsx
"use client";
import LeftMessage from "@/components/mess-group/LeftMessage/LeftMessage";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import { getRealTimeOfUser } from "@/lib/services/user/getRealTime";
import React, { useEffect } from "react";

const MessageLayout = ({ children }: { children: React.ReactNode }) => {
  const { dataChat } = useChatContext();
  const { setIsOnlineChat, setTimeOfflineChat, isOnlineChat } =
    useUserContext();
  //Get realTime in the first time
  useEffect(() => {
    if (!dataChat) {
      return;
    }

    const fetchRealTimeData = async () => {
      for (const box of dataChat) {
        for (const user of box.memberInfo) {
          try {
            const data = await getRealTimeOfUser(user._id);
            if (data) {
              if (!data.isOnline) {
                setTimeOfflineChat((prev) => ({
                  ...prev,
                  [user._id]: data.updateTime // Lưu thời gian cập nhật
                }));
              }
              setIsOnlineChat((prevState) => ({
                ...prevState,
                [user._id]: data.isOnline
              }));
            } else {
              setIsOnlineChat((prevState) => ({
                ...prevState,
                [user._id]: false
              }));
            }
          } catch (error) {
            console.error(
              `Failed to fetch real-time data for user ${user._id}:`,
              error
            );
          }
        }
      }
    };

    fetchRealTimeData();
  }, [dataChat]);
  return (
    <section className="py-[16px] pr-[16px] w-full flex h-full overflow-hidden">
      <div className={`flex flex-row w-[25%]`}>
        <LeftMessage />
      </div>
      <div className="flex h-full w-[75%] bg-transparent flex-grow-0">
        {children}
      </div>
    </section>
  );
};

export default MessageLayout;
