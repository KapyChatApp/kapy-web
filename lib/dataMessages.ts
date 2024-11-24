import { SegmentMessProps } from "@/types/mess-group";
import axios from "axios";

export interface FileContent {
  fileName: string;
  url: string;
  publicId: string;
  bytes: string;
  width: string;
  height: string;
  format: string;
  type: string;
}
export interface GPSContent {
  type: "gps";
  latitude: number;
  longitude: number;
  description?: string;
}

export interface ResponseMessageDTO {
  id: string;
  flag: boolean;
  readedId: string[];
  contentId: FileContent[] | GPSContent[];
  text: string[];
  createAt: string;
  createBy: string;
}

let messageData: ResponseMessageDTO[];
export const fetchMessages = async (
  boxId: string
): Promise<ResponseMessageDTO[]> => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) throw new Error("Authentication token not found");
  try {
    // Gọi API để lấy danh sách tin nhắn dựa vào boxId
    const response = await axios.get(
      `${process.env.BASE_URL}message/all?boxId=${boxId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    const apiMessages: ResponseMessageDTO[] = response.data.messages;
    if (apiMessages && Array.isArray(apiMessages)) {
      messageData = await Promise.all(
        apiMessages.map(async (msg) => {
          return {
            id: msg.id,
            flag: msg.flag || false,
            readedId: msg.readedId || [],
            contentId: msg.contentId || [],
            text: msg.text,
            createAt: msg.createAt || "",
            createBy: msg.createBy
          };
        })
      );
      return messageData;
    }

    // Nếu không có dữ liệu trả về, trả về một mảng rỗng
    return [];
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
};
export { messageData };
