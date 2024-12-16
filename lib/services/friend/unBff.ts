import { FriendRequestDTO } from "@/lib/DTO/friend";

async function unBestFriend(param: FriendRequestDTO) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }

    const response = await fetch(`${process.env.BASE_URL}request/unbff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${storedToken}`
      },
      body: JSON.stringify(param)
    });

    if (!response.ok) {
      throw new Error("Failed to cancel best friend.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Xử lý lỗi
  }
}
