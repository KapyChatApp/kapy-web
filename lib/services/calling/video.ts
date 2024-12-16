import axios from "axios";

export async function tokenProvider(): Promise<string> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      return "";
    }
    const response = await axios.get(
      `${process.env.BASE_URL}calling/video-call`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );
    const apiResponse = response.data;
    if (!apiResponse) {
      throw new Error(`Server error: ${apiResponse}`);
    }

    localStorage.setItem("tokenProvider", apiResponse);
    return apiResponse;
  } catch (error) {
    console.error("Error get token PROVIDER:", error);
    return ""; // Trả về kiểu phù hợp với kiểu đã khai báo
  }
}
