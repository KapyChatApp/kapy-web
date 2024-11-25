"use client";
import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import { ChatProvider } from "@/context/ChatContext";
import { checkTokenFrontend } from "@/lib/check-toke";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

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
    <ChatProvider>
      <main className="background-light850_dark200 flex flex-row overflow-scroll scrollable w-full cursor-default h-screen min-w-[492px]">
        <LeftSidebar />
        <section className="bg-transparent w-full flex flex-row h-full overflow-y-hidden">
          <div className="h-full w-full cursor-default ">{children}</div>
        </section>
      </main>
    </ChatProvider>
  );
};

export default Layout;
