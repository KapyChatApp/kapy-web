import { FriendProfileResponseDTO, FriendResponseDTO } from "@/lib/DTO/friend";

export const defaultFriendProfileResponseDTO: FriendProfileResponseDTO = {
  _id: "",
  firstName: "",
  lastName: "",
  nickName: "",
  phoneNumber: "",
  email: "",
  avatar: "",
  background: "",
  gender: false, // false for unspecified or default
  address: "",
  job: "",
  hobbies: "",
  bio: "",
  point: 0,
  relationShip: "",
  birthDay: new Date(0), // Default to epoch or earliest possible date
  attendDate: new Date(0),
  relation: "",
  mutualFriends: 0
};

export const fetchFriendProfile = async (
  friendId: string,
  setError: React.Dispatch<React.SetStateAction<string>>
): Promise<FriendProfileResponseDTO> => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    setError("No token found");
    return defaultFriendProfileResponseDTO; // Giá trị mặc định
  }

  try {
    const response = await fetch(
      `${process.env.BASE_URL}friend/profile?friendId=${friendId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}` // Gửi token trong header
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch friend profile");
    }

    const data: FriendProfileResponseDTO = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching friend profile:", error);
    setError(error.message);
    return defaultFriendProfileResponseDTO; // Trả về giá trị mặc định nếu lỗi xảy ra
  }
};
