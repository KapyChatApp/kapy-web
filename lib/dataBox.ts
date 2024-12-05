import { useState, useEffect } from "react";
import axios from "axios";
import { formatTimeMessageBox } from "./utils";
import { ResponseMessageDTO } from "./dataMessages";

// Interface FE
export interface UserInfoBox {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  phone: string;
}
export interface MessageBoxContent {
  id: string;
  senderName: string;
  receiverInfo: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
  };
  content: string;
  createAt: string;
  pin: boolean;
  isOnline: boolean;
  lastMessage: ResponseMessageDTO;
  readStatus: boolean;
}

// Interface Response
interface ResponseUserInfoBox {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  phone: string;
}
interface MessageBoxDTO {
  _id: string;
  senderId: string | ResponseUserInfoBox;
  receiverIds: ResponseUserInfoBox[];
  groupName: string;
  groupAva: string;
  flag: boolean;
  pin: boolean;
  lastMessage: ResponseMessageDTO;
  readStatus: boolean;
}
export interface ResponseMessageBoxDTO {
  box: MessageBoxDTO[];
  adminId: string;
}

export const fetchMessageBox = async (
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxContent[]>>,
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
    const updatedDataChat: MessageBoxContent[] = sortedApiDataChat
      .map((item) => {
        let content = ""; // Mặc định là rỗng nếu không có message
        let detailContent = "";

        // Kiểm tra xem có messageIds hay không
        if (item.lastMessage && item.lastMessage.text !== "") {
          content = item.lastMessage.text;
        } else {
          if (item.lastMessage && item.lastMessage.contentId) {
            const contentType = item.lastMessage.contentId.type;
            detailContent =
              contentType === "Image"
                ? "Sent a photo"
                : contentType === "Video"
                ? "Sent a video"
                : contentType === "Audio"
                ? "Sent an audio"
                : contentType === "Other"
                ? "Sent a file"
                : "";
            content = detailContent;
          }
        }
        const receiver = item.receiverIds.find(
          (receiver) => receiver._id !== apiDataChat.adminId
        );
        let receiverInfo;
        if (receiver) {
          receiverInfo = {
            id: receiver._id,
            name: receiver.firstName + " " + receiver.lastName,
            phone: receiver.phone,
            avatar: receiver.avatar
          };
        } else {
          receiverInfo = {
            id: "",
            name: "Unknown",
            phone: "",
            avatar: "/assets/ava/default.png"
          };
        }
        // Nếu messageIds trống, trả về đối tượng với content rỗng
        if (content === "") {
          return {
            id: item._id,
            senderName: "",
            receiverInfo: receiverInfo,
            content: "",
            createAt: "", // Có thể để rỗng nếu không có thông tin thời gian
            pin: false,
            isOnline: false,
            readStatus: item.readStatus
          };
        }
        // Tìm sender và receiver
        const sender = item.receiverIds.find(
          (sender) => sender._id === item.lastMessage.createBy
        );
        let senderInfo;
        if (sender) {
          senderInfo = {
            id: sender._id,
            name: sender.firstName + " " + sender.lastName,
            phone: sender.phone,
            avatar: sender.avatar
          };
        } else {
          senderInfo = {
            id: "",
            name: "Unknown",
            phone: "",
            avatar: "/assets/ava/default.png"
          };
        }
        return {
          id: item._id,
          senderName:
            item.lastMessage.createBy === apiDataChat.adminId ? "You:" : "",
          receiverInfo: receiverInfo,
          content: content,
          createAt: formatTimeMessageBox(item.lastMessage?.createAt),
          pin: false,
          isOnline: false,
          readStatus: item.readStatus
        };
      })
      .filter((item): item is MessageBoxContent => item !== null); // Loại bỏ các giá trị null

    setDataChat(updatedDataChat);
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching messages:", err);
  }
};
