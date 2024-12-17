import { FriendRequestDTO, FriendResponseDTO } from "@/lib/DTO/friend";

export async function unBlock(
  param: FriendRequestDTO,
  setListBlockedFriend: React.Dispatch<
    React.SetStateAction<FriendResponseDTO[]>
  >
) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }

    const response = await fetch(`${process.env.BASE_URL}request/unblock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${storedToken}`
      },
      body: JSON.stringify(param)
    });

    if (!response.ok) {
      throw new Error("Failed to unblock.");
    }

    const data = await response.json();
    setListBlockedFriend((prev) =>
      prev.filter((friend) => friend._id !== param.receiver)
    );
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Xử lý lỗi
  }
}
