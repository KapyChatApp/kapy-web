import axios from "axios";

export async function deletePost(postId: string): Promise<boolean> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      return false;
    }

    const response = await axios.delete(
      `${process.env.BASE_URL}post/delete?postId=${postId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    const apiResponse = response.data;
    if (!apiResponse) {
      throw new Error(`Server error: ${apiResponse.error}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false; // Nếu có lỗi xảy ra, trả về false
  }
}
