"use client";
import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListRequestedFriend } from "@/lib/data/mine/dataRequestFriend";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { listRequestedFriend, setListRequestedFriend } = useFriendContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestedFriends = async () => {
      try {
        await getMyListRequestedFriend(setListRequestedFriend, console.error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestedFriends();
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
