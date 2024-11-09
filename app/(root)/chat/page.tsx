"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Sử dụng useRouter để điều hướng
import { dataChat, fetchMessageBox } from "@/lib/dataBox";

export default function Page() {
  const router = useRouter(); // Khởi tạo router từ Next.js
  const [loading, setLoading] = useState(true); // Trạng thái loading để tránh render lại

  useEffect(() => {
    // Gọi hàm fetchMessageBox khi trang được tải
    const fetchData = async () => {
      await fetchMessageBox();
    };
    fetchData();

    if (dataChat.length === 0) {
      console.warn("Không có tin nhắn trong messChat.");
      setLoading(false);
      return;
    }

    // Tìm tin nhắn mới nhất từ dataChat
    const latestMessage = dataChat.reduce((latest, current) => {
      const latestTime = new Date(latest.time).getTime();
      const currentTime = new Date(current.time).getTime();

      return currentTime > latestTime ? current : latest;
    }, dataChat[0]);

    if (latestMessage && latestMessage.id) {
      // Điều hướng đến trang chat của tin nhắn mới nhất
      router.push(`/chat/${latestMessage.id}`);
    } else {
      console.warn("Không tìm thấy tin nhắn mới nhất hoặc thiếu `id`.");
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang xử lý
  }

  return null; // Không hiển thị giao diện sau khi điều hướng
}
