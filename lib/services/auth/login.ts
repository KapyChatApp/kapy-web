import { defaultUserResponseDTO } from "@/context/UserContext";
import { UserLoginDTO, UserRegisterDTO, UserResponseDTO } from "@/lib/DTO/user";

export const loginUser = async (
  params: UserLoginDTO
): Promise<{ message: string; token: string }> => {
  try {
    const response = await fetch(`${process.env.BASE_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: "Login failed", token: "" };
    }

    const data = await response.json();
    const token = data.token;
    localStorage.setItem("token", token);

    return { message: data.message, token: token };
  } catch (error) {
    console.error("Error registering user:", error);
    return { message: "Login failed", token: "" };
  }
};
