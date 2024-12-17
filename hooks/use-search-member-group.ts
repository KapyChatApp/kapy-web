// useSearch.ts
import { UserInfoBox } from "@/lib/DTO/message";
import { useState } from "react";

const useSearchMember = (friendList: UserInfoBox[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = friendList.filter((fr) =>
    (fr.firstName + fr.lastName)
      .trim()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return { searchTerm, setSearchTerm, filteredMembers };
};

export default useSearchMember;
