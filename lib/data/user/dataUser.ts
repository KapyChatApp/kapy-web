import { ResponseUserInfo } from "@/lib/DTO/user";
import axios from "axios";

// Cập nhật interface để trả về đầy đủ thông tin của người dùng

let userData: ResponseUserInfo;
export const fetchUser = async (
  userId: string
): Promise<ResponseUserInfo | null> => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return null;
  if (!userId) return null;

  try {
    const response = await axios.get(
      `${process.env.BASE_URL}user/findUserById?userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    const apiUserData = response.data;

    if (apiUserData) {
      userData = {
        id: apiUserData._id,
        firstName: apiUserData.firstName,
        lastName: apiUserData.lastName,
        nickName:
          apiUserData.nickName || apiUserData.firstName + apiUserData.lastName,
        avatar: apiUserData.avatar || "/assets/ava/default.png",
        email: apiUserData.email,
        phoneNumber: apiUserData.phoneNumber,
        address: apiUserData.address || "",
        job: apiUserData.job || "",
        hobbies: apiUserData.hobbies || "",
        bio: apiUserData.bio || "",
        birthDay: apiUserData.birthDay ? apiUserData.birthDay.toString() : "",
        attendDate: apiUserData.attendDate
          ? apiUserData.attendDate.toString()
          : "",
        relationShip: apiUserData.relationShip || "",
        flag: apiUserData.flag || true,
        friendIds: apiUserData.friendIds || [],
        bestFriendIds: apiUserData.bestFriendIds || [],
        blockedIds: apiUserData.blockedIds || [],
        posts: apiUserData.posts || []
      };

      // Trả về đối tượng người dùng đã được gán thông tin
      return userData;
    }

    throw new Error("User not found");
  } catch (error: any) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};
export { userData };
