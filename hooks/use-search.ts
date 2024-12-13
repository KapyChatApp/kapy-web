// useSearch.ts
import { FriendResponseDTO } from "@/lib/DTO/friend";
import { HistoryFindFriend, StrangeFriend } from "@/types/friends";
import { User } from "@/types/object";
import { useState } from "react";

const useSearch = (friendList: FriendResponseDTO[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = friendList.filter((fr) => {
    const name = fr.firstName + fr.lastName;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return { searchTerm, setSearchTerm, filteredFriends };
};

export default useSearch;
