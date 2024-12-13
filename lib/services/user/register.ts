import { defaultUserResponseDTO } from "@/context/UserContext";
import { UserRegisterDTO } from "@/lib/DTO/user";

export const registerUser = async (params: UserRegisterDTO) => {
  try {
    const response = await fetch(`${process.env.BASE_URL}user/register-web`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register user");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data.newUser;
  } catch (error) {
    console.error("Error registering user:", error);
    return defaultUserResponseDTO;
  }
};
