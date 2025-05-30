import { ResponseMessageDTO } from "@/lib/DTO/message";
import axios from "axios";

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
            contentId: msg.contentId,
            text: msg.text,
            boxId: msg.boxId,
            createAt: msg.createAt || "",
            createBy: msg.createBy,
            isReact: msg.isReact
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
