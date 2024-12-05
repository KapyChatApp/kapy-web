import axios from "axios";

export interface PusherRevoke {
  id: string;
  flag: boolean;
  isReact: boolean;
  text: string;
  boxId: string;
  action: string;
  createAt: string;
  createBy: string;
}
export async function RevokeMessage(messageId: string): Promise<boolean> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }

    const response = await axios.delete(
      `${process.env.BASE_URL}message/revoke`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        },
        params: { messageId } // Truyền messageId trong query params
      }
    );
    const apiResponse = response.data;
    if (!apiResponse.success) {
      throw new Error(`Server error: ${apiResponse.messages}`);
    }

    return apiResponse.success;
  } catch (error) {
    console.error("Error checking token:", error);
    return false; // Trả về kiểu phù hợp với kiểu đã khai báo
  }
}
