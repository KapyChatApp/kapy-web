import {
  MessageBoxInfo,
  ResponseMessageBoxDTO,
  UserInfoBox
} from "@/lib/DTO/message";
import axios from "axios";

export const fetchMessageBox = async (
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
      `${process.env.BASE_URL}message/all-box-chat`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    const apiDataChat: ResponseMessageBoxDTO = responseChat.data;
    localStorage.setItem("adminId", apiDataChat.adminId);
    console.log(apiDataChat);

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
      .map((item) => {
        const memberInfo: UserInfoBox[] = item.receiverIds.map((mem) => ({
          id: mem._id,
          firstName: mem.firstName,
          lastName: mem.lastName,
          phone: mem.phoneNumber,
          avatar: mem.avatar,
          nickName: mem.nickName,
          isOnline: false
        }));

        const receiver = item.receiverIds.find(
          (receiver) => receiver._id !== apiDataChat.adminId
        );
        let receiverInfo: UserInfoBox;
        if (receiver) {
          receiverInfo = {
            id: receiver._id,
            firstName: receiver.firstName,
            lastName: receiver.lastName,
            phone: receiver.phoneNumber,
            avatar: receiver.avatar,
            nickName: receiver.nickName,
            isOnline: false
          };
        } else {
          receiverInfo = {
            id: "",
            firstName: "Unknown",
            lastName: "",
            phone: "",
            avatar: "/assets/ava/default.png",
            nickName: "",
            isOnline: false
          };
        }
        return {
          id: item._id,
          receiverInfo: receiverInfo,
          memberInfo: memberInfo,
          groupName: "",
          groupAva: "",
          pin: false,
          readStatus: item.readStatus
        };
      })
      .filter((item): item is MessageBoxInfo => item !== null);

    setDataChat(updatedDataChat);
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching messages:", err);
  }
};
