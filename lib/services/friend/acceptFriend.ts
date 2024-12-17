import {
  FriendRequestDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";

export async function acceptFriend(
  param: FriendRequestDTO,
  setListRequestedFriend: React.Dispatch<
    React.SetStateAction<RequestedResponseDTO[]>
  >
) {
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
    setListRequestedFriend((prev) =>
      prev.filter((friend) => friend._id !== param.receiver)
    );
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Xử lý lỗi
  }
}
