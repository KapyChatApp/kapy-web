import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListBestFriend } from "@/lib/data/mine/dataBestFriend";
import React, { useEffect, useState } from "react";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { listBestFriend, setListBestFriend } = useFriendContext();

  useEffect(() => {
    // Gọi API lấy danh sách bạn thân khi component mount
    const fetchData = async () => {
      try {
        await getMyListBestFriend(setListBestFriend, setError);
        console.log(listBestFriend);
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
