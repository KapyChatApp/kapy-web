import { UserResponseDTO } from "@/lib/DTO/user";
import axios from "axios";

export const getMyProfile = async (
  setMyProfile: React.Dispatch<React.SetStateAction<UserResponseDTO>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    setError("No token found");
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
    console.log(adminInfo);

    setMyProfile(adminInfo);
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching your profile:", err);
  }
};
