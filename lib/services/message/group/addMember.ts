import axios from "axios";

export async function addMemberToGroup(boxId: string, newMember: string[]) {
  try {
    const storedToken = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!storedToken) {
      return {
        success: false,
        message: "Token is missing or invalid."
      };
    }

    // Gửi yêu cầu POST đến API bằng axios
    const response = await axios.post(
      `${process.env.BASE_URL}message/group/addMember`,
      { boxId, newMember },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    // Trả về kết quả thành công hoặc thất bại
    return response.data;
  } catch (error) {
    console.error("Error adding members:", error);

    // Nếu có lỗi, trả về thông báo lỗi
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
