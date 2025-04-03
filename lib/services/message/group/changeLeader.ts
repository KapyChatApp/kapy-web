import axios from "axios";

export async function changeGroupLeader(boxId: string, newLeader: string) {
  try {
    const storedToken = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!storedToken) {
      return {
        success: false,
        message: "Token is missing or invalid."
      };
    }

    // Gọi API để thay đổi leader nhóm
    const response = await axios.put(
      `${process.env.BASE_URL}message/group/changeLeader`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        },
        params: {
          boxId,
          newLeader
        }
      }
    );

    return response.data; // Trả về kết quả thành công hoặc thất bại
  } catch (error) {
    console.error("Error changing group leader:", error);

    // Nếu có lỗi, trả về thông báo lỗi
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
