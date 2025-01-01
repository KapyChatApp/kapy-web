import { RealTimeResponse } from "@/lib/DTO/realtime";

export async function getRealTimeOfUser(
  userId: string
): Promise<RealTimeResponse> {
  try {
    // Lấy token từ localStorage
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      throw new Error("Unauthorized: Token is missing");
    }

    // Gọi API
    const response = await fetch(
      `${process.env.BASE_URL}realtime/user?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}` // Thêm token vào header
        }
      }
    );

    // Kiểm tra trạng thái phản hồi
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Trả về dữ liệu JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch real-time user data:", error);
    throw error;
  }
}
