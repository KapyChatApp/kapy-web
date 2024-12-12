import axios from "axios";

export async function markMessageAsRead(boxId: string): Promise<boolean> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      return false;
    }

    const response = await axios.post(
      `${process.env.BASE_URL}message/mark-read`,
      { boxId: boxId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
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
