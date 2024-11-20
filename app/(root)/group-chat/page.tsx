"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Sử dụng useRouter để điều hướng
import { fetchMessageBoxGroup } from "@/lib/dataBoxGroup";
import { MessageBoxContent } from "@/lib/dataBox";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataGroup, setDataGroup] = useState<MessageBoxContent[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchMessageBoxGroup(setDataGroup, setError);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && dataGroup.length === 0) {
      console.warn("Không có tin nhắn trong groupChat.");
      return;
    }

    if (!loading && dataGroup.length > 0) {
      // Tìm tin nhắn mới nhất từ groupData
      const latestMessage = dataGroup.reduce((latest, current) => {
        const latestTime = new Date(latest.createAt).getTime();
        const currentTime = new Date(current.createAt).getTime();
        return currentTime > latestTime ? current : latest;
      }, dataGroup[0]);

      if (latestMessage && latestMessage.id) {
        // Điều hướng đến trang chat của tin nhắn mới nhất
        router.push(`/group-chat/${latestMessage.id}`);
      } else {
        console.warn("Không tìm thấy tin nhắn mới nhất hoặc thiếu `id`.");
      }
    }
  }, [loading, dataGroup, router]);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang xử lý
  }

  return null; // Không hiển thị giao diện sau khi điều hướng
}
