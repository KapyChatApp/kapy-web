// useSearch.ts
import { HistoryFindFriend, StrangeFriend } from "@/types/friends";
import { User } from "@/types/object";
import { useState } from "react";

const useSearch = (
  friendList: User[] | HistoryFindFriend[] | StrangeFriend[]
) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = friendList.filter((fr) =>
    fr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, setSearchTerm, filteredFriends };
};

export default useSearch;
