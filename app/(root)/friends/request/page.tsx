"use client";
import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListRequestedFriend } from "@/lib/data/mine/dataRequestFriend";
import React, { useEffect, useState } from "react";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { listRequestedFriend, setListRequestedFriend } = useFriendContext();

  useEffect(() => {
    // Gọi API lấy danh sách bạn thân khi component mount
    const fetchData = async () => {
      try {
        await getMyListRequestedFriend(setListRequestedFriend, setError);
        console.log(listRequestedFriend);
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
