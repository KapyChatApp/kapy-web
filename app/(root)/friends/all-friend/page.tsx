"use client";
import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListFriend } from "@/lib/data/mine/dataAllFriends";
import { getMyListBestFriend } from "@/lib/data/mine/dataBestFriend";
import { getMyListRequestedFriend } from "@/lib/data/mine/dataRequestFriend";
import { getMyListSuggestedFriend } from "@/lib/data/mine/dataSuggestFriends";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MyFriendPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const {
    listFriend,
    setListFriend,
    listBestFriend,
    setListBestFriend,
    listRequestedFriend,
    setListRequestedFriend,
    listSuggestedFriend,
    setListSuggestedFriend
  } = useFriendContext();

  const fetchData = async () => {
    try {
      await Promise.all([
        getMyListBestFriend(setListBestFriend, setError),
        getMyListFriend(setListFriend, setError),
        getMyListRequestedFriend(setListRequestedFriend, setError),
        getMyListSuggestedFriend(setListSuggestedFriend, setError)
      ]);
    } catch (err) {
      setError("Failed to fetch data.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    router.push(`/friends/all-friend`);
  }, [router]);

  if (
    !listBestFriend ||
    !listFriend ||
    !listRequestedFriend ||
    !listSuggestedFriend
  ) {
    return (
      <div className="flex h-screen w-screen items-center justify-center background-light900_dark400">
        <div className="loader"></div>
      </div>
    );
  }
  return <RightComponent />;
};

export default MyFriendPage;
