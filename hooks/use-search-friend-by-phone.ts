import {
  FindUserDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";
import { findUserByPhone } from "@/lib/services/user/searchByPhone";
import { useState, useEffect } from "react";

const useSearchFriendByPhone = (
  friendList: FriendResponseDTO[] | FindUserDTO[] | RequestedResponseDTO[]
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<
    FriendResponseDTO[] | FindUserDTO[] | RequestedResponseDTO[]
  >([]);
  const [isSearching, setIsSearching] = useState(false); // Trạng thái đang tìm kiếm

  useEffect(() => {
    const search = async () => {
      // Kiểm tra nếu searchTerm là số điện thoại
      const isPhoneNumber = /^\d+$/.test(searchTerm.trim());

      if (isPhoneNumber && searchTerm != "") {
        setIsSearching(true);
        try {
          // Gọi API tìm kiếm số điện thoại
          const data = await findUserByPhone(searchTerm.trim());
          console.log(data);
          setFilteredFriends([data]); // Cập nhật danh sách tìm kiếm theo số điện thoại
        } catch (error) {
          console.error("Finding friend by phone failed:", error);
          setFilteredFriends([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        // Tìm kiếm theo tên
        const filtered = friendList.filter((fr) => {
          const name = (fr.firstName + fr.lastName).toLowerCase();
          return name.includes(searchTerm.toLowerCase());
        }) as FriendResponseDTO[] | FindUserDTO[] | RequestedResponseDTO[];

        setFilteredFriends(filtered);
      }
    };

    if (searchTerm) {
      search();
    } else {
      setFilteredFriends(friendList); // Reset khi không có từ khóa
    }
    console.log(filteredFriends);
  }, [searchTerm]);

  return { searchTerm, setSearchTerm, filteredFriends, isSearching };
};

export default useSearchFriendByPhone;
