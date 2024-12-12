import {
  MessageBoxInfo,
  ResponseMessageBoxDTO,
  UserInfoBox
} from "@/lib/DTO/message";
import axios from "axios";

export const fetchMessageBoxGroup = async (
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxInfo[]>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    setError("No token found");
    return;
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

    const apiDataChat: ResponseMessageBoxDTO = responseChat.data;
    const sortedApiDataChat = apiDataChat.box.sort((a: any, b: any) => {
      if (a.lastMessage && b.lastMessage) {
        const timeA = new Date(a.lastMessage.createAt || 0).getTime();
        const timeB = new Date(b.lastMessage.createAt || 0).getTime();
        return timeB - timeA;
      }
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return 0;
    });
    // Xử lý dữ liệu từ response để tạo ra dataChat
    const updatedDataChat: MessageBoxInfo[] = sortedApiDataChat
      .map((item: any) => {
        const memberInfo: UserInfoBox[] = item.receiverIds.map((mem: any) => ({
          id: mem._id,
          firstName: mem.firstName,
          lastName: mem.lastName,
          phone: mem.phoneNumber,
          avatar: mem.avatar,
          nickName: mem.nickName,
          isOnline: false
        }));
        return {
          id: item._id,
          receiverInfo: {
            id: item._id,
            firstName: "",
            lastName: item.groupName,
            phone: item.groupName,
            avatar: item.groupAva
          },
          memberInfo: memberInfo,
          groupName: item.groupName,
          groupAva: item.groupAva,
          pin: false,
          readStatus: item.readStatus
        };
      })
      .filter((item: any): item is MessageBoxInfo => item !== null); // Loại bỏ các giá trị null

    setDataChat(updatedDataChat);
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching messages:", err);
  }
};
