import { SegmentMessProps } from "@/types/mess-group";
import axios from "axios";
import { fetchUser, userData, UserInfo } from "./dataUser";
import { userInfo } from "os";
// export interface ImageContent {
//   type: "image";
//   url: string;
//   altText?: string;
// }
// export interface LinkContent {
//   type: "link";
//   url: string;
//   title?: string;
// }
// export interface FileContent {
//   type: "file";
//   fileName: string;
//   fileUrl: string;
//   fileType: string;
// }
// export interface VideoContent {
//   type: "video";
//   fileName: string;
//   fileUrl: string;
//   fileType: string;
//   duration: number;
// }
// export interface VoiceContent {
//   type: "voice";
//   fileName: string;
//   fileUrl: string;
//   fileType: string;
//   duration: number;
// }
// export interface PostContent {
//   type: "post";
//   userId: string;
//   likedIds?: string[];
//   shares?: string[];
//   comments?: string[];
//   content: string;
// }
// export interface IconContent {
//   type: "icon";
//   name: string;
// }
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
  latitude: number; // Vĩ độ
  longitude: number; // Kinh độ
  description?: string; // Mô tả địa điểm (tuỳ chọn)
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

    const apiMessages: ResponseMessageDTO[] = response.data;
    if (apiMessages && Array.isArray(apiMessages)) {
      // Lặp qua tất cả các tin nhắn và gọi API để lấy thông tin người gửi
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
