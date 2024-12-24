import { RequestedResponseDTO } from "@/lib/DTO/friend";

export const getMyListRequestedFriend = async (
  setListRequestedFriend: React.Dispatch<
    React.SetStateAction<RequestedResponseDTO[]>
  >,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    setError("No token found");
    return;
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}mine/requested`, {
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

    const data: RequestedResponseDTO[] = result.map(
      (item: RequestedResponseDTO) => {
        return {
          _id: item._id,
          avatar: item.avatar,
          firstName: item.firstName,
          lastName: item.lastName,
          relation: item.relation,
          createAt: item.createAt,
          mutualFriends: item.mutualFriends ? item.mutualFriends : []
        };
      }
    );
    setListRequestedFriend(data);
    return data;
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching list friend:", err);
  }
};
