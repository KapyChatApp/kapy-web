import { useState, useEffect } from "react";
import axios from "axios";
import { formatTimeMessageBox } from "./utils";
import { ResponseMessageDTO } from "./dataMessages";
import { MessageBoxContent, ResponseMessageBoxDTO } from "./dataBox";

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
    const updatedDataChat: MessageBoxContent[] = sortedApiDataChat
      .map((item: any) => {
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
        if (content === "") {
          return {
            id: item._id,
            senderName: "",
            receiverInfo: {
              id: item._id,
              name: item.groupName,
              phone: item.groupName,
              avatar: item.groupAva
            },
            content: "",
            createAt: "", // Có thể để rỗng nếu không có thông tin thời gian
            pin: false,
            isOnline: false,
            readStatus: item.readStatus
          };
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
            item.lastMessage.createBy === apiDataChat.adminId ? "You" : "",
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
          readStatus: item.readStatus
        };
      })
      .filter((item: any): item is MessageBoxContent => item !== null); // Loại bỏ các giá trị null

    setDataChat(updatedDataChat);
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching messages:", err);
  }
};
