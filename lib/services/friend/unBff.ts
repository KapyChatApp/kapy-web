import { FriendRequestDTO, FriendResponseDTO } from "@/lib/DTO/friend";

export async function unBestFriend(
  param: FriendRequestDTO,
  setListBestFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>
) {
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
    setListBestFriend((prev) =>
      prev.filter((friend) => friend._id !== param.receiver)
    );
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Xử lý lỗi
  }
}
