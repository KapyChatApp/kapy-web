import { FriendRequestDTO, FriendResponseDTO } from "@/lib/DTO/friend";

export async function unFriend(
  param: FriendRequestDTO,
  setListFriend?: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>
) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }

    const response = await fetch(`${process.env.BASE_URL}request/unfriend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${storedToken}`
      },
      body: JSON.stringify(param)
    });

    if (!response.ok) {
      throw new Error("Failed to unfriend.");
    }

    const data = await response.json();
    if (setListFriend) {
      setListFriend((prev) =>
        prev.filter((friend) => friend._id !== param.receiver)
      );
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Xử lý lỗi
  }
}
