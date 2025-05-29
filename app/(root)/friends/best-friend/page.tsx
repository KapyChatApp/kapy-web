"use client";
import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListBestFriend } from "@/lib/data/mine/dataBestFriend";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { listBestFriend, setListBestFriend } = useFriendContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyListBestFriend(setListBestFriend, console.error).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="loader" />
      </div>
    );

  return <RightComponent />;
};

export default Page;
