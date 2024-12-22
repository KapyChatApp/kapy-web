"use client";
import { LeftSidbarSettingProps } from "@/types/settings";
import React, { useEffect, useState } from "react";
import FirstFrame from "./FirstFrame";
import SecondFrame from "./SecondFrame";
import ThirdFrame from "./ThirdFrame";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListBlockedFriend } from "@/lib/data/mine/dataBlockFriends";

const PrivacySetting = ({ setRenderRight }: LeftSidbarSettingProps) => {
  const [isSelectedMessage, setSelectedMessage] = useState("everyone");
  const [isSelectedCalling, setSelectedCalling] = useState("everyone");
  const { listBlockedFriend, setListBlockedFriend } = useFriendContext();
  const [error, setError] = useState<string>("");
  const [unBlock, setUnBlock] = useState(false);
  const [isIndex, setIndex] = useState("");

  useEffect(() => {
    // Gọi API lấy danh sách bạn thân khi component mount
    const fetchData = async () => {
      try {
        await getMyListBlockedFriend(setListBlockedFriend, setError);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchData();
  }, [setListBlockedFriend]);

  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full justify-start items-start">
        <FirstFrame />

        <SecondFrame
          isSelectedCalling={isSelectedCalling}
          setSelectedCalling={setSelectedCalling}
          isSelectedMessage={isSelectedMessage}
          setSelectedMessage={setSelectedMessage}
        />

        <ThirdFrame
          userBlock={listBlockedFriend}
          setIndex={setIndex}
          isIndex={isIndex}
        />
      </div>
    </>
  );
};

export default PrivacySetting;
