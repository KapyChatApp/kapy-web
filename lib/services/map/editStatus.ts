import { EditMapStatusDTO, MapStatusResponseDTO } from "@/lib/DTO/map";
import axios from "axios";

export const editMapStatus = async (
  data: EditMapStatusDTO,
  statusId: string
): Promise<any> => {
  try {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.warn("No token found");
      return;
    }
    const formData = new FormData();
    if (data.caption) {
      formData.append("caption", data.caption);
    }
    if (data.file) {
      formData.append("file", data.file);
    }
    if (data.keepOldContent) {
      formData.append("keepOldContent", data.keepOldContent.toString());
    }

    const response = await axios.patch(
      `${process.env.BASE_URL}livemap/status/edit?statusId=${statusId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo sử dụng multipart/form-data
          Authorization: `${storedToken}` // Đính kèm token
        }
      }
    );

    const result: MapStatusResponseDTO = response.data;

    return result;
  } catch (error: any) {
    console.error("Error editing map status:", error.response?.data || error);
    throw new Error(error.response?.data?.error || "Failed to edit map status");
  }
};
