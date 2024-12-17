import { FriendRequestDTO } from "@/lib/DTO/friend";

export async function addFriendRequest(param: FriendRequestDTO) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }

    const response = await fetch(`${process.env.BASE_URL}request/friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${storedToken}`
      },
      body: JSON.stringify(param)
    });

    if (!response.ok) {
      throw new Error("Failed to add friend.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Xử lý lỗi
  }
}
