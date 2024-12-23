import axios from "axios";

export async function deleteMessageBox(boxId: string): Promise<boolean> {
  try {
    // Lấy token từ localStorage
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      return false;
    }

    // Gửi yêu cầu DELETE đến backend
    const response = await axios.delete(
      `${process.env.BASE_URL}message/deleteBox`, // Điều chỉnh URL phù hợp với endpoint của bạn
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}` // Gửi token trong header Authorization
        },
        params: { boxId } // Truyền boxId qua query params
      }
    );

    const apiResponse = response.data;
    if (!apiResponse.success) {
      throw new Error(`Server error: ${apiResponse.message}`);
    }

    return apiResponse.success;
  } catch (error) {
    console.error("Error deleting message box:", error);
    return false;
  }
}
