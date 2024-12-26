import axios from "axios";

export async function removeMemberFromGroup(
  boxId: string,
  targetedId?: string
) {
  try {
    const storedToken = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!storedToken) {
      return {
        success: false,
        message: "Token is missing or invalid."
      };
    }

    // Nếu không có targetedId, sử dụng userId (theo logic của API backend)
    const response = await axios.delete(
      `${process.env.BASE_URL}message/group/removeMember`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        },
        params: {
          boxId,
          targetedId
        }
      }
    );

    // Trả về kết quả thành công hoặc thất bại
    return response.data;
  } catch (error) {
    console.error("Error removing member:", error);

    // Nếu có lỗi, trả về thông báo lỗi
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
