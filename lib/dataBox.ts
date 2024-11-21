import { useState, useEffect } from "react";
import axios from "axios";
import { formatTimeMessageBox } from "./utils";
import { ResponseMessageDTO } from "./dataMessages";

// Interface FE
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
  isSeen: boolean;
}

//Interface Response
interface UserInfoBox {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  phone: string;
}
interface MessageBoxDTO {
  _id: string;
  senderId: string | UserInfoBox;
  receiverIds: UserInfoBox[];
  groupName: string;
  groupAva: string;
  flag: boolean;
  pin: boolean;
  isSeen: boolean;
  lastMessage: ResponseMessageDTO;
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

    // Xử lý dữ liệu từ response để tạo ra dataChat
    const updatedDataChat = apiDataChat.box
      .map((item) => {
        if (item.lastMessage.readedId) {
          const isSeen = item.lastMessage.readedId.some(
            (reader: any) => reader._id === apiDataChat.adminId
          );

          let content = item.lastMessage.text[item.lastMessage.text.length - 1];
          let detailContent = "";

          if (item.lastMessage.contentId?.length > 0) {
            const contentType = item.lastMessage.contentId[0].type;
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

          return {
            id: item._id,
            senderName:
              item.lastMessage.createBy === apiDataChat.adminId
                ? "You"
                : senderInfo.name,
            receiverInfo: receiverInfo,
            content: content,
            createAt: formatTimeMessageBox(item.lastMessage?.createAt),
            pin: false,
            isOnline: false,
            isSeen: isSeen
          };
        }
        return null;
      })
      .filter((item): item is MessageBoxContent => item !== null); // Loại bỏ các giá trị null

    setDataChat(updatedDataChat);
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching messages:", err);
  }
};
