import { FriendResponseDTO } from "@/lib/DTO/friend";
import { useState } from "react";

const useSearchFriend = (user: FriendResponseDTO[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriend = user.filter((item) => {
    // Kiểm tra xem item có phải là đối tượng hợp lệ và có otherName hay không
    let name = item.firstName + item.lastName;
    if (item && typeof item === "object" && name) {
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Nếu item không hợp lệ, trả về false để loại bỏ khỏi filteredBox
    return false;
  });

  return { searchTerm, setSearchTerm, filteredFriend };
};

export default useSearchFriend;
