import { defaultUserResponseDTO } from "@/context/UserContext";
import { AuthResponsDTO } from "@/lib/DTO/auth";
import { UserLoginDTO, UserRegisterDTO, UserResponseDTO } from "@/lib/DTO/user";

const defaultDevice: AuthResponsDTO = {
  _id: "",
  logTime: new Date(),
  deviceName: "",
  deviceType: "",
  brand: "",
  modelName: "",
  osName: "",
  osVersion: "",
  region: "",
  isSafe: false,
  isActive: false,
  user: {
    _id: "",
    firstName: "",
    lastName: "",
    nickName: "",
    avatar: ""
  }
};

export const loginUser = async (
  params: UserLoginDTO
): Promise<{ message: string; token: string; device: AuthResponsDTO }> => {
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
      return { message: "Login failed", token: "", device: defaultDevice };
    }

    const data = await response.json();
    const token = data.token;
    console.log(data.device, "check");
    localStorage.setItem("token", token);

    return { message: data.message, token: token, device: data.device };
  } catch (error) {
    console.error("Error registering user:", error);
    return { message: "Login failed", token: "", device: defaultDevice };
  }
};
