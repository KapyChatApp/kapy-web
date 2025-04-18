import axios from "axios";
import { FriendProfileResponseDTO } from "../DTO/friend";
import { ResponseUserInfo } from "../DTO/user";
import { PostResponseDTO } from "../DTO/post";

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

export const fetchDetailProfile = async (
  friendId: string,
  setError: React.Dispatch<React.SetStateAction<string>>
): Promise<FriendProfileResponseDTO | null> => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    setError("No token found");
    return null; // Giá trị mặc định
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
    return null; // Trả về giá trị mặc định nếu lỗi xảy ra
  }
};

export const fetchUserPost = async (
  userId: string,
  isMine: boolean,
  setError: React.Dispatch<React.SetStateAction<string>>
): Promise<PostResponseDTO[] | []> => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    setError("No token found");
    return []; // Giá trị mặc định
  }

  try {
    const response = isMine
      ? await fetch(`${process.env.BASE_URL}mine/post`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${storedToken}` // Gửi token trong header
          }
        })
      : await fetch(`${process.env.BASE_URL}post/friend?friendId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${storedToken}` // Gửi token trong header
          }
        });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch all post of user");
    }

    const data: PostResponseDTO[] = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching friend profile:", error);
    setError(error.message);
    return []; // Trả về giá trị mặc định nếu lỗi xảy ra
  }
};
