// useSearch.ts
import { FriendResponseDTO, RequestedResponseDTO } from "@/lib/DTO/friend";
import { HistoryFindFriend, StrangeFriend } from "@/types/friends";
import { useState } from "react";

const useSearch = (
  friendList: FriendResponseDTO[] | RequestedResponseDTO[]
) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = friendList.filter((fr) => {
    const name = fr.firstName + fr.lastName;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return { searchTerm, setSearchTerm, filteredFriends };
};

export default useSearch;
