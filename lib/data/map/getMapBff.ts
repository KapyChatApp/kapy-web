import { MapStatusResponseDTO } from "@/lib/DTO/map";
import { defaultValue } from "@/lib/services/map/getMineMap";
import axios from "axios";

export const getMyBestFriendMapStatus = async (): Promise<
  MapStatusResponseDTO[]
> => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    console.warn("No token found");
    return [defaultValue]; // Trả về defaultValue nếu không có token
  }

  try {
    const response = await axios.get(`${process.env.BASE_URL}livemap/bff`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: ` ${storedToken}` // Thêm token vào headers
      }
    });

    // Đảm bảo response có dữ liệu hợp lệ
    const result: MapStatusResponseDTO[] = response.data;
    console.log(response.data);
    return result || defaultValue;
  } catch (err: any) {
    console.warn(
      err.message || "An error occurred while fetching best friend map status."
    );
    console.error("Error fetching data:", err);
    return [defaultValue]; // Trả về defaultValue khi có lỗi
  }
};
