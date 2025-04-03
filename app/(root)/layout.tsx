"use client";
import CallNotification from "@/components/mess-group/CallNotification";
import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import { OnlineEvent } from "@/lib/DTO/user";
import { getPusherClient } from "@/lib/pusher";
import { checkTokenFrontend } from "@/lib/services/auth/check-token";
import { isOffline } from "@/lib/services/user/isOffline";
import { isOnline } from "@/lib/services/user/isOnline";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { dataChat } = useChatContext();

  //Set realTime
  const checkOnlineStatus = async (token: string) => {
    try {
      const result = await isOnline(token);
      console.log("User online status:", result);
    } catch (error) {
      console.error("Error checking online status:", error);
    }
  };
  const setOfflineStatus = async (token: string) => {
    try {
      await isOffline(token);
      console.log("User is offline");
    } catch (error) {
      console.error("Error setting offline status:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Gọi `checkOnlineStatus` khi ở trong layout
    checkOnlineStatus(token);

    const handleBeforeUnload = () => {
      setOfflineStatus(token); // Người dùng đóng tab/trang
    };
    // Lắng nghe sự kiện trước khi tải lại hoặc đóng trang
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      setOfflineStatus(token); // Đặt trạng thái offline khi rời layout
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  //Online Pusher
  const { setIsOnlineChat, setTimeOfflineChat, isOnlineChat } =
    useUserContext();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    const pusherClient = getPusherClient();

    const handleOnline = (data: OnlineEvent) => {
      console.log("Successfully received online-status:", data);
      setIsOnlineChat((prevState) => ({
        ...prevState,
        [data.userId]: true
      }));
    };

    const handleOffline = (data: OnlineEvent) => {
      console.log("Successfully received offline-status:", data);
      setIsOnlineChat((prevState) => ({
        ...prevState,
        [data.userId]: false
      }));
      setTimeOfflineChat((prevState) => ({
        ...prevState,
        [data.userId]: data.updateTime
      }));
    };

    dataChat.forEach((box) => {
      box.memberInfo.forEach((user) => {
        if (user._id !== adminId) {
          pusherClient.subscribe(`private-${user._id}`);
          pusherClient.bind("online-status", handleOnline);
          pusherClient.bind("offline-status", handleOffline);
        }
      });
    });
  });

  const router = useRouter();
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const result = await checkTokenFrontend(token);
        console.log(result);
        if (
          (!result && typeof result === "object") ||
          !result.isAuthenticated
        ) {
          router.push("/signin");
        }
      } else {
        router.push("/signin");
      }
    };

    verifyToken();
  });

  return (
    <main className="background-light850_dark200 flex flex-row overflow-scroll scrollable w-full cursor-default h-screen min-w-[492px]">
      <LeftSidebar />
      <section className="bg-transparent w-full flex flex-row h-full overflow-y-hidden">
        <div className="h-full w-full cursor-default ">
          {/* <StreamVideoProvider>{children}</StreamVideoProvider> */}
          {children}
        </div>
      </section>

      <CallNotification />
    </main>
  );
};

export default Layout;
