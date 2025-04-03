"use client";
import { getMyListSuggestedFriend } from "@/lib/data/mine/dataSuggestFriends";
import { FriendResponseDTO } from "@/lib/DTO/friend";
import React, { useEffect, useState } from "react";
import SuggestionCard from "./SuggestionCard";

const Suggestion = () => {
  const [error, setError] = useState<string>("");

  const [suggestList, setSuggestList] = useState<FriendResponseDTO[]>([]);
  useEffect(() => {
    // Gọi API lấy danh sách bạn thân khi component mount
    const fetchData = async () => {
      try {
        await getMyListSuggestedFriend(setSuggestList, setError);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-auto h-auto">
        <span className="text-xl lg:text-2xl font-medium lg:font-bold text-dark100_light900">
          Suggestions
        </span>
      </div>

      <div className="mt-6 flex flex-col items-start w-full">
        {suggestList.map((item) => (
          <SuggestionCard item={item} />
        ))}
      </div>
    </div>
  );
};

export default Suggestion;
Suggestion;
