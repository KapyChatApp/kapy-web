// useSearch.ts
import { MessageBoxProps } from "@/types/mess-group";
import { MememberGroup, User } from "@/types/object";
import { useState } from "react";

const useSearchMessageBox = (box: MessageBoxProps[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBox = box.filter((box) =>
    box.otherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, setSearchTerm, filteredBox };
};

export default useSearchMessageBox;
