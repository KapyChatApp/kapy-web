import axios from "axios";

export async function disbandGroup(boxId: string) {
  try {
    const storedToken = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!storedToken) {
      return {
        success: false,
        message: "Token is missing or invalid."
      };
    }

    // Gọi API để giải tán nhóm
    const response = await axios.delete(
      `${process.env.BASE_URL}message/group/disband`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        },
        params: {
          boxId
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error disbanding group:", error);

    // Nếu có lỗi, trả về thông báo lỗi
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
