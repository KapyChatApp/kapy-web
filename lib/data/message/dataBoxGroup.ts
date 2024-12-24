import { MessageBoxDTO, MessageBoxInfo, UserInfoBox } from "@/lib/DTO/message";
import axios from "axios";

export const fetchMessageBoxGroup = async (
  setError: React.Dispatch<React.SetStateAction<string>>
): Promise<MessageBoxInfo[]> => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    setError("No token found");
    return [];
  }

  try {
    const responseChat = await axios.get(
      `${process.env.BASE_URL}message/all-box-group`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    const apiDataChat = responseChat.data;
    const sortedApiDataChat: MessageBoxDTO[] = apiDataChat.box.sort(
      (a: any, b: any) => {
        if (a.lastMessage && b.lastMessage) {
          const timeA = new Date(a.lastMessage.createAt || 0).getTime();
          const timeB = new Date(b.lastMessage.createAt || 0).getTime();
          return timeB - timeA;
        }
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return 0;
      }
    );
    // Xử lý dữ liệu từ response để tạo ra dataChat
    const updatedDataChat: MessageBoxInfo[] = sortedApiDataChat
      .map((item: any) => {
        return {
          id: item._id,
          receiverInfo: {
            _id: item._id,
            firstName: "",
            lastName: item.groupName,
            avatar: item.groupAva
          },
          memberInfo: item.receiverIds,
          groupName: item.groupName,
          groupAva: item.groupAva,
          pin: false,
          readedId: item.readedId,
          readStatus: item.readStatus,
          stranger: false
        };
      })
      .filter((item: any): item is MessageBoxInfo => item !== null); // Loại bỏ các giá trị null
    return updatedDataChat;
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching messages:", err);
    return [];
  }
};
