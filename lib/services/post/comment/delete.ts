import axios from "axios";
export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }

    const response = await axios.delete(
      `${process.env.BASE_URL}post/comment/delete`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        },
        params: { commentId } // Truyền messageId trong query params
      }
    );
    const apiResponse = response.data;
    if (!apiResponse) {
      throw new Error(`Server error: ${apiResponse.messages}`);
    }

    return true;
  } catch (error) {
    console.error("Error checking token:", error);
    return false; // Trả về kiểu phù hợp với kiểu đã khai báo
  }
}
