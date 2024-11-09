import { useEffect, useState } from "react";
import axios from "axios";
import { MessageBoxProps } from "@/types/mess-group";
import { formatTimeMessageBox } from "./utils";
import { Group } from "@/types/object";

// Tạo các biến lưu trữ dữ liệu và hàm khởi tạo để export
let dataChat: MessageBoxProps[] = [];
let dataGroup: MessageBoxProps[] = [];
let apiGroupInfo: Group[] = [];
let apiDataChat: any;
let apiDataGroup: any;

export const fetchMessageBox = async () => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return;

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
    const responseGroup = await axios.get(
      `${process.env.BASE_URL}message/all-box-group`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    apiDataChat = responseChat.data;
    apiDataGroup = responseGroup.data;

    localStorage.setItem("adminId", apiDataChat.userId);

    //Message Box of Chat
    dataChat = apiDataChat.box.box.map((item: any) => {
      if (item.lastMessage.readedId) {
        const isSeen = item.lastMessage.readedId.some(
          (reader: any) => reader._id === apiDataChat.userId
        );
        return {
          id: item._id,
          otherName: item.receiverIds[0]?.nickName || "Unknown",
          otherId: item.receiverIds[0]?._id || "",
          ava: item.receiverIds[0]?.avatar || "/assets/ava/default.png",
          sender:
            item.senderId?._id === apiDataChat.userId
              ? "You"
              : item.senderId?.nickName || "Unknown",
          content: item.lastMessage.contentId[0]?.content || "",
          time: formatTimeMessageBox(
            item.lastMessage.contentId[item.lastMessage.contentId.length - 1]
              ?.createAt
          ),
          pin: false,
          isOnline: true,
          isSeen: isSeen
        };
      }
      return null;
    });

    //Message Box of Group
    dataGroup = apiDataGroup.box.box.map((item: any) => {
      const isSeen =
        item.lastMessage && item.lastMessage.readedId
          ? item.lastMessage.readedId.some(
              (reader: any) => reader._id === apiDataGroup.userId
            )
          : false;
      if (item.messageIds.length > 0) {
        return {
          id: item._id,
          otherName: item.groupName,
          otherId: "",
          ava: item.groupAva,
          sender:
            item.senderId?._id === apiDataGroup.userId
              ? "You"
              : item.senderId?.nickName || "Unknown",
          content: item.lastMessage.contentId[0]?.content || "",
          time: formatTimeMessageBox(
            item.lastMessage.contentId[item.lastMessage.contentId.length - 1]
              ?.createAt
          ),
          pin: false,
          isOnline: true,
          isSeen: isSeen
        };
      } else {
        return {
          id: item._id,
          otherName: item.groupName,
          otherId: "",
          ava: item.groupAva,
          sender: "",
          content: "This is a new group message.",
          time: formatTimeMessageBox(item.createAt),
          pin: false,
          isOnline: true,
          isSeen: true
        };
      }
    });

    //Group Info
    apiGroupInfo = apiDataGroup.box.box.map((item: any) => {
      if (item.receiverIds && item.senderId) {
        return {
          id: item._id,
          name: item.groupName || "Unknown",
          ava: item.groupAva || "/assets/ava/default.png",
          createdAt: item.createAt || "",
          createdBy: {
            _id: item.senderId._id,
            firstName: item.senderId.firstName || "Unknown",
            lastName: item.senderId.lastName || "Unknown",
            nickName: item.senderId.nickName || "Unknown",
            avatar: item.senderId.avatar || "/assets/ava/default.png"
          },
          members: [
            // Thêm người tạo nhóm vào đầu mảng
            {
              _id: item.senderId._id,
              nickName: item.senderId.nickName || "Unknown",
              avatar: item.senderId.avatar || "/assets/ava/default-avatar.png"
            },
            // Sau đó là các thành viên còn lại (receiverIds)
            ...item.receiverIds.map((receiver: any) => ({
              _id: receiver._id,
              nickName: receiver.nickName || "Unknown",
              avatar: receiver.avatar || "/assets/ava/default-avatar.png"
            }))
          ]
        };
      }
      return null;
    });
  } catch (err: any) {
    console.error("Error fetching messages:", err);
    setError(err.message);
  }
};

// Export dữ liệu
export { dataChat, dataGroup, apiDataChat, apiDataGroup, apiGroupInfo };
function setError(message: any) {
  throw new Error("Function not implemented.");
}
