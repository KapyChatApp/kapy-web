"use client";
import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListFriend } from "@/lib/data/mine/dataAllFriends";
import { getMyListBestFriend } from "@/lib/data/mine/dataBestFriend";
import { getMyListRequestedFriend } from "@/lib/data/mine/dataRequestFriend";
import React, { useEffect, useState } from "react";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const {
    listFriend,
    setListFriend,
    listBestFriend,
    setListBestFriend,
    listRequestedFriend,
    setListRequestedFriend
  } = useFriendContext();

  useEffect(() => {
    // Gọi API lấy danh sách bạn bè khi component mount
    const fetchData = async () => {
      try {
        await getMyListFriend(setListFriend, setError);
        console.log(listFriend);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchData();
  }, [setListFriend]);

  useEffect(() => {
    // Gọi API lấy danh sách bạn thân khi component mount
    const fetchData = async () => {
      try {
        await getMyListBestFriend(setListBestFriend, setError);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchData();
  }, [setListBestFriend]);

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
  }, [setListRequestedFriend]);

  if (!listBestFriend || !listFriend || !listRequestedFriend) {
    return (
      <div className="flex h-screen w-screen items-center justify-center background-light900-dark400">
        <div className="loader"></div>
      </div>
    );
  }
  return <RightComponent />;
};

export default page;
