import { LocationDTO } from "@/lib/DTO/location";
import { MapStatusResponseDTO } from "@/lib/DTO/map";
import axios from "axios";

// Cập nhật defaultValue đầy đủ và chính xác
export const defaultValue: MapStatusResponseDTO = {
  _id: "",
  caption: "",
  content: {
    _id: "",
    fileName: "",
    url: "",
    bytes: 0,
    width: 0,
    height: 0,
    format: "",
    type: ""
  },
  location: {
    latitude: 0, // Vĩ độ
    longitude: 0, // Kinh độ
    altitude: 0, // Độ cao so với mực nước biển (nếu có)
    accuracy: 0, // Độ chính xác của vĩ độ và kinh độ (mét)
    altitudeAccuracy: 0, // Độ chính xác của độ cao (mét, nếu có)
    heading: 0, // Hướng di chuyển của thiết bị (độ)
    speed: 0
  },
  createAt: "",
  createBy: {
    _id: "",
    firstName: "",
    lastName: "",
    nickName: "",
    avatar: ""
  }
};

export const getMyMap = async (
  param: LocationDTO,
  setError: React.Dispatch<React.SetStateAction<string>>
): Promise<MapStatusResponseDTO> => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    setError("No token found");
    return defaultValue; // Trả về defaultValue nếu không có token
  }

  try {
    // Gọi đồng thời cả hai API sử dụng Promise.all
    const [getMineStatusResponse, initiateMapResponse] = await Promise.all([
      axios.get(`${process.env.BASE_URL}mine/map-status`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }),
      axios.post(`${process.env.BASE_URL}livemap/initiate`, param, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      })
    ]);

    // Đảm bảo response có dữ liệu hợp lệ
    const response1: MapStatusResponseDTO = getMineStatusResponse.data;
    const response2: MapStatusResponseDTO = initiateMapResponse.data;

    // Trả về kết quả hợp lệ, nếu không có trả về defaultValue
    const result = response1 || response2 || defaultValue;

    return result;
  } catch (err: any) {
    setError(err.message || "An error occurred while fetching map status.");
    console.error("Error calling APIs:", err);
    return defaultValue; // Trả về defaultValue khi có lỗi
  }
};
