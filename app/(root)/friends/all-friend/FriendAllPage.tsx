"use client";
import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListFriend } from "@/lib/data/mine/dataAllFriends";
import React, { useEffect, useState } from "react";

const FriendAllPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { listFriend, setListFriend } = useFriendContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMyListFriend(setListFriend, setError);
      } catch {
        setError("Failed to load all friends.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  return <RightComponent />;
};

export default FriendAllPage;
