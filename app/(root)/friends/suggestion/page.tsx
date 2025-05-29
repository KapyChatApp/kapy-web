"use client";
import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListSuggestedFriend } from "@/lib/data/mine/dataSuggestFriends";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { listSuggestedFriend, setListSuggestedFriend } = useFriendContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
        await getMyListSuggestedFriend(setListSuggestedFriend, console.error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedFriends();
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

export default Page;
