import { FriendRequestDTO, FriendResponseDTO } from "@/lib/DTO/friend";

export async function acceptFriend(param: FriendRequestDTO) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }

    const response = await fetch(
      `${process.env.BASE_URL}request/accept-friend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        },
        body: JSON.stringify(param)
      }
    );

    if (!response.ok) {
      throw new Error("Failed to accept friend.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Xử lý lỗi
  }
}
