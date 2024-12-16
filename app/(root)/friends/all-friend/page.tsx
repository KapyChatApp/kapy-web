"use client";
import RightComponent from "@/components/friends/RightComponent";
import { user } from "@/constants/object";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListFriend } from "@/lib/data/mine/dataAllFriends";
import { getMyListBestFriend } from "@/lib/data/mine/dataBestFriend";
import React, { useEffect, useState } from "react";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { listFriend, setListFriend } = useFriendContext();

  useEffect(() => {
    // Gọi API lấy danh sách bạn bè khi component mount
    const fetchData = async () => {
      try {
        await getMyListFriend(setListFriend, setError);
        console.log(listFriend);
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
