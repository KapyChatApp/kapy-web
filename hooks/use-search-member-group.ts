// useSearch.ts
import { HistoryFindFriend, StrangeFriend } from "@/types/friends";
import { MememberGroup, User } from "@/types/object";
import { useState } from "react";

const useSearchMember = (friendList: MememberGroup[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = friendList.filter((fr) =>
    fr.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, setSearchTerm, filteredMembers };
};

export default useSearchMember;
