"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMessageBox, MessageBoxContent } from "@/lib/dataBox";
import { MessageBoxProps } from "@/types/mess-group";
import { fetchMessageBoxGroup } from "@/lib/dataBoxGroup";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataChat, setDataChat] = useState<MessageBoxContent[]>([]);
  const [dataGroup, setDataGroup] = useState<MessageBoxContent[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchMessageBox(setDataChat, setError);
    fetchMessageBoxGroup(setDataGroup, setError);
    setLoading(false);
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

      console.log("latestsMess: ", latestMessage);

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
