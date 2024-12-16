"use client";
import { useUserContext } from "@/context/UserContext";
import { tokenProvider } from "@/lib/services/calling/video";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { adminInfo } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const token = await tokenProvider();
        if (!token) return;
        if (!apiKey) throw new Error("Stream API key missing");

        const client = StreamVideoClient.getOrCreateInstance({
          apiKey,
          user: {
            id: adminInfo?._id,
            name:
              adminInfo?.firstName + " " + adminInfo?.lastName ||
              adminInfo?.nickName,
            image: adminInfo?.avatar
          },
          token
        });

        setVideoClient(client);
      } catch (error) {
        console.error("Error initializing video client:", error);
      } finally {
        setIsLoading(false); // Đặt trạng thái loading là false khi đã xong
      }
    };

    initializeClient();
  }, [adminInfo]);

  if (isLoading) {
    return <div>Loading video client...</div>;
  }

  if (!videoClient) {
    return <div>Error initializing video client</div>; // Hiển thị thông báo lỗi nếu không khởi tạo được client
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
