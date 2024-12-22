import { UserResponseDTO } from "@/lib/DTO/user";
import axios from "axios";

export const getMyProfile = async (
  setMyProfile: React.Dispatch<React.SetStateAction<UserResponseDTO>>
) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    console.log("No token found");
    return;
  }

  try {
    const responseChat = await axios.get(
      `${process.env.BASE_URL}mine/profile`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    const adminInfo: UserResponseDTO = responseChat.data;
    localStorage.setItem("adminId", adminInfo._id);
    setMyProfile(adminInfo);
  } catch (err: any) {
    console.error("Error fetching your profile:", err);
  }
};
