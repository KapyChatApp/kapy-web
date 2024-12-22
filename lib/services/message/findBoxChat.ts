import axios from "axios";

export async function findBoxChat(receiverId: string): Promise<string> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      return "";
    }

    const response = await axios.get(
      `${process.env.BASE_URL}message/findBoxChat?receiverId=${receiverId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );
    const apiResponse = response.data;
    return apiResponse.boxId;
  } catch (error) {
    console.error("Error checking token:", error);
    return ""; // Trả về kiểu phù hợp với kiểu đã khai báo
  }
}
