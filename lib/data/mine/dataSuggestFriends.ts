import { FriendResponseDTO } from "@/lib/DTO/friend";
import { UserResponseDTO } from "@/lib/DTO/user";

export const getMyListSuggestedFriend = async (
  setListSuggestedFriend: React.Dispatch<
    React.SetStateAction<FriendResponseDTO[]>
  >,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    setError("No token found");
    return;
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}friend/suggest`, {
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
    setListSuggestedFriend(data);
    return data;
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching list friend:", err);
  }
};
