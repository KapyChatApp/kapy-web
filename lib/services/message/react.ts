import { ResponseReactMessageDTO } from "@/lib/DTO/message";
import axios from "axios";

export const defaultResponseReact: ResponseReactMessageDTO = {
  id: "",
  boxId: "",
  isReact: []
};
export async function reactMessage(
  messageId: string
): Promise<ResponseReactMessageDTO> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      return defaultResponseReact;
    }

    const response = await axios.post(
      `${process.env.BASE_URL}message/react`,
      { messageId: messageId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );
    const apiResponse = response.data;
    if (!apiResponse) {
      throw new Error(`Server error`);
    }

    return apiResponse;
  } catch (error) {
    console.error("Error checking token:", error);
    return defaultResponseReact; // Trả về kiểu phù hợp với kiểu đã khai báo
  }
}
