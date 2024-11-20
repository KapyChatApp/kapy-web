import { useState, useEffect } from "react";
import axios from "axios";
import { formatTimeMessageBox } from "./utils";
import { ResponseMessageDTO } from "./dataMessages";
import { MessageBoxContent, ResponseMessageBoxDTO } from "./dataBox";

// Hàm xử lý fetch dữ liệu MessageBox
export const fetchMessageBoxGroup = async (
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
      `${process.env.BASE_URL}message/all-box-group`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    const apiDataChat: any = responseChat.data;
    // Xử lý dữ liệu từ response để tạo ra dataChat
    const updatedDataChat = apiDataChat.box.box
      .map((item: any) => {
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
            (sender: any) => sender._id === item.lastMessage.createBy
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
              item.lastMessage.createBy === apiDataChat.adminId
                ? "You"
                : senderInfo.name,
            receiverInfo: {
              id: item._id,
              name: item.groupName,
              phone: item.groupName,
              avatar: item.groupAva
            },
            content: content,
            createAt: formatTimeMessageBox(item.lastMessage?.createAt),
            pin: false,
            isOnline: true,
            isSeen: isSeen
          };
        }
        return null;
      })
      .filter((item: any): item is MessageBoxContent => item !== null); // Loại bỏ các giá trị null

    setDataChat(updatedDataChat);
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching messages:", err);
  }
};
