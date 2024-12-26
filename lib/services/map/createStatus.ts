import { CreateMapStatusDTO, MapStatusResponseDTO } from "@/lib/DTO/map";
import axios from "axios";

export const createMapStatus = async (
  data: CreateMapStatusDTO
): Promise<any> => {
  try {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.warn("No token found");
      return;
    }
    // Tạo FormData để gửi file và caption
    const formData = new FormData();
    formData.append("caption", data.caption);
    if (data.file) {
      formData.append("file", data.file);
    }

    // Gửi yêu cầu đến backend
    const response = await axios.post(
      `${process.env.BASE_URL}livemap/status/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo sử dụng multipart/form-data
          Authorization: ` ${storedToken}` // Đính kèm token
        }
      }
    );

    const result: MapStatusResponseDTO = response.data;

    return result;
  } catch (error: any) {
    console.error("Error creating map status:", error.response?.data || error);
    throw new Error(
      error.response?.data?.error || "Failed to create map status"
    );
  }
};
