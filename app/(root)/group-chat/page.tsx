"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Sử dụng useRouter để điều hướng
import { dataGroup, fetchMessageBox } from "@/lib/dataBox";

export default function Page() {
  const router = useRouter(); // Khởi tạo router từ Next.js
  const [loading, setLoading] = useState(true); // Trạng thái loading để tránh render lại

  useEffect(() => {
    // Gọi hàm fetchMessageBox khi trang được tải
    const fetchData = async () => {
      await fetchMessageBox();
    };
    fetchData();

    if (dataGroup.length === 0) {
      console.warn("Không có tin nhắn trong groupChat.");
      setLoading(false); // Dừng trạng thái loading khi dữ liệu đã được kiểm tra
      return;
    }

    // Tìm tin nhắn mới nhất từ dataChat
    const latestMessage = dataGroup.reduce((latest, current) => {
      const latestTime = new Date(latest.time).getTime();
      const currentTime = new Date(current.time).getTime();

      return currentTime > latestTime ? current : latest;
    }, dataGroup[0]);

    if (latestMessage && latestMessage.id) {
      // Điều hướng đến trang chat của tin nhắn mới nhất
      router.push(`/group-chat/${latestMessage.id}`);
    } else {
      console.warn("Không tìm thấy tin nhắn mới nhất hoặc thiếu `id`.");
    }

    setLoading(false); // Dừng trạng thái loading sau khi hoàn thành điều hướng
  }, []); // Chạy useEffect chỉ một lần khi component được mount

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang xử lý
  }

  return null; // Không hiển thị giao diện sau khi điều hướng
}
