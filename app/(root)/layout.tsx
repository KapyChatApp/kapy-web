"use client";
import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import { checkTokenFrontend } from "@/lib/services/auth/check-toke";
import { isOffline } from "@/lib/services/user/isOffline";
import { isOnline } from "@/lib/services/user/isOnline";
import { getPusherClient } from "@/lib/pusher";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { OnlineEvent } from "./chat/page";
import { getMyProfile } from "@/lib/data/mine/dataAdmin";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { dataChat } = useChatContext();
  const router = useRouter();
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [error, setError] = useState<string>("");
  const { adminInfo, setAdminInfo } = useUserContext();

  // const { setIsOnlineChat, adminInfo } = useUserContext();
  // // API để gọi trạng thái online
  // const checkOnlineStatus = async (token: string) => {
  //   try {
  //     const result = await isOnline(token); // Gọi API kiểm tra trạng thái online
  //     console.log("User online status:", result);
  //     // Xử lý kết quả từ API
  //   } catch (error) {
  //     console.error("Error checking online status:", error);
  //   }
  // };
  // // API để gọi trạng thái offline
  // const setOfflineStatus = async (token: string) => {
  //   try {
  //     await isOffline(token); // Gọi API để cập nhật trạng thái offline
  //     console.log("User is offline");
  //   } catch (error) {
  //     console.error("Error setting offline status:", error);
  //   }
  // };
  // useEffect(() => {
  //   const token = localStorage.getItem("token"); // Lấy token từ localStorage

  //   if (token) {
  //     checkOnlineStatus(token); // Kiểm tra trạng thái online khi lần đầu vào trang

  //     // Hàm kiểm tra trạng thái online sau mỗi 10s
  //     const intervalId = setInterval(() => {
  //       if (document.hidden) {
  //         // Nếu tab bị ẩn (người dùng chuyển tab), kiểm tra trạng thái offline
  //         if (isTabVisible) {
  //           setOfflineStatus(token); // Chỉ gọi setOfflineStatus nếu tab đã ẩn
  //           setIsTabVisible(false); // Đánh dấu trạng thái tab đã ẩn
  //         }
  //       } else {
  //         // Nếu tab không ẩn (người dùng vẫn ở trên trang), kiểm tra trạng thái online
  //         checkOnlineStatus(token);
  //         if (!isTabVisible) {
  //           setIsTabVisible(true); // Đánh dấu trạng thái tab đang hiển thị
  //         }
  //       }
  //     }, 10000); // Kiểm tra sau mỗi 10 giây

  //     const handleVisibilityChange = () => {
  //       if (document.hidden) {
  //         // Nếu tab bị ẩn (người dùng chuyển tab), cập nhật trạng thái offline
  //         if (token) {
  //           setOfflineStatus(token);
  //           setIsTabVisible(false);
  //         }
  //       } else {
  //         // Nếu tab được hiển thị lại (người dùng quay lại tab), kiểm tra trạng thái online
  //         if (token) {
  //           checkOnlineStatus(token);
  //           setIsTabVisible(true);
  //         }
  //       }
  //     };

  //     const handleBeforeUnload = () => {
  //       if (token) {
  //         setOfflineStatus(token);
  //       }
  //     };

  //     document.addEventListener("visibilitychange", handleVisibilityChange);
  //     window.addEventListener("beforeunload", handleBeforeUnload);

  //     // Cleanup: Dọn dẹp các sự kiện và interval khi component unmount
  //     return () => {
  //       //clearInterval(intervalId); // Xóa interval
  //       document.removeEventListener(
  //         "visibilitychange",
  //         handleVisibilityChange
  //       );
  //       window.removeEventListener("beforeunload", handleBeforeUnload);
  //     };
  //   }
  // }, [isTabVisible]);
  // useEffect(() => {
  //   const adminId = adminInfo._id;
  //   // Tạo một tham chiếu để lưu trữ các đăng ký
  //   const pusherClient = getPusherClient();

  //   const handleOnline = (data: OnlineEvent) => {
  //     console.log("Successfully received online-status:", data);
  //     setIsOnlineChat((prevState) => ({
  //       ...prevState,
  //       [data.userId]: true
  //     }));
  //   };

  //   const handleOffline = (data: OnlineEvent) => {
  //     console.log("Successfully received offline-status:", data);
  //     setIsOnlineChat((prevState) => ({
  //       ...prevState,
  //       [data.userId]: false
  //     }));
  //   };

  //   dataChat.forEach((box) => {
  //     box.memberInfo.forEach((user) => {
  //       if (user.id !== adminId) {
  //         pusherClient.subscribe(`private-${user.id}`);
  //         pusherClient.bind("online-status", handleOnline);
  //         pusherClient.bind("offline-status", handleOffline);
  //       }
  //     });
  //   });
  // }, [dataChat]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      await getMyProfile(setAdminInfo, setError);

      if (token) {
        const result = await checkTokenFrontend(token);
        console.log(result);
        if (result && typeof result === "object" && result.isAuthenticated) {
          router.push("/chat");
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }
    };

    verifyToken();
  }, [router]);
  return (
    <main className="background-light850_dark200 flex flex-row overflow-scroll scrollable w-full cursor-default h-screen min-w-[492px]">
      <LeftSidebar />
      <section className="bg-transparent w-full flex flex-row h-full overflow-y-hidden">
        <div className="h-full w-full cursor-default ">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
