"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Sử dụng useRouter để điều hướng
import { fetchMessageBoxGroup } from "@/lib/dataBoxGroup";
import { MessageBoxContent } from "@/lib/dataBox";
import { useChatContext } from "@/context/ChatContext";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { dataChat, setDataChat } = useChatContext();

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

  useEffect(() => {
    if (!loading && dataChat.length === 0) {
      console.warn("Không có tin nhắn trong groupChat.");
      return;
    }

    if (!loading && dataChat.length > 0) {
      router.push(`/group-chat/${dataChat[0].id}`);
    }
  }, [loading, dataChat, router]);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang xử lý
  }

  return null; // Không hiển thị giao diện sau khi điều hướng
}
