import { FriendResponseDTO } from "@/lib/DTO/friend";
import { UserResponseDTO } from "@/lib/DTO/user";

export const getMyListBlockedFriend = async (
  setListBlockedFriend: React.Dispatch<
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
    const response = await fetch(`${process.env.BASE_URL}mine/blocks`, {
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

    const data: FriendResponseDTO[] = result;
    setListBlockedFriend(data);
    return data;
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching list friend:", err);
  }
};
