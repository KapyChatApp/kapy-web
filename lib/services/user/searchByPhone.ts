import { FindUserDTO } from "@/lib/DTO/friend";

// services/userService.ts
export const defaultFindUser: FindUserDTO = {
  _id: "",
  firstName: "",
  lastName: "",
  nickName: "",
  avatar: "",
  relation: "",
  status: false,
  mutualFriends: 0
};

export const findUserByPhone = async (phoneNumber: string) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      return defaultFindUser; // Giá trị mặc định
    }

    const response = await fetch(
      `${process.env.BASE_URL}user/find?phonenumber=${phoneNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user by phone number:", error);
    throw error;
  }
};
