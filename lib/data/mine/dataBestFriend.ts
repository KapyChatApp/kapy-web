import { FriendResponseDTO } from "@/lib/DTO/friend";
import { UserResponseDTO } from "@/lib/DTO/user";

export const getMyListBestFriend = async (
  setListBestFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>,
  setError?: React.Dispatch<React.SetStateAction<string>>
) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken && setError) {
    setError("No token found");
    return;
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}mine/bffs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Thêm token nếu cần
        Authorization: `${storedToken}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch friends");
    }

    const result = await response.json();

    const data: FriendResponseDTO[] = result.map((item: FriendResponseDTO) => {
      return {
        _id: item._id,
        avatar: item.avatar,
        firstName: item.firstName,
        lastName: item.lastName,
        nickName: item.nickName,
        mutualFriends: item.mutualFriends ? item.mutualFriends : []
      };
    });
    console.log(data);
    setListBestFriend(data);
    return data;
  } catch (err: any) {
    console.error(err.message);
    console.error("Error fetching list friend:", err);
  }
};
