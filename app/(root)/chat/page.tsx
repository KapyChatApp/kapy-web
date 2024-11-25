"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMessageBox, MessageBoxContent } from "@/lib/dataBox";
import { MessageBoxProps } from "@/types/mess-group";
import { fetchMessageBoxGroup } from "@/lib/dataBoxGroup";
import { fetchMessages, ResponseMessageDTO } from "@/lib/dataMessages";
import { useChatContext } from "@/context/ChatContext";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { dataChat, setDataChat } = useChatContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMessageBox(setDataChat, setError);
        console.log("dataChat after fetch: ", dataChat);
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
      console.warn("No detail in messChat.");
      return;
    }

    if (!loading && dataChat.length > 0) {
      // Find the latest message based on time
      const latestMessage = dataChat.reduce((latest, current) => {
        const latestTime = new Date(latest.createAt).getTime();
        const currentTime = new Date(current.createAt).getTime();
        return currentTime > latestTime ? current : latest;
      }, dataChat[0]);

      if (latestMessage && latestMessage.id) {
        router.push(`/chat/${latestMessage.id}`);
      } else {
        console.warn("Dont find the latest message or id.");
      }
    }
  }, [loading, dataChat, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
}
