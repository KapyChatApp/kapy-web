"use client";
import LeftComponent from "@/components/friends/LeftComponent";
import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListSuggestedFriend } from "@/lib/data/mine/dataSuggestFriends";
import React, { useEffect, useState } from "react";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { listSuggestedFriend, setListSuggestedFriend } = useFriendContext();

  useEffect(() => {
    // Gọi API lấy danh sách bạn thân khi component mount
    const fetchData = async () => {
      try {
        await getMyListSuggestedFriend(setListSuggestedFriend, setError);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <RightComponent />;
};

export default page;
