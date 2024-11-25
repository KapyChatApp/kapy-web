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
    console.log(apiDataChat);
    // Xử lý dữ liệu từ response để tạo ra dataChat
    const updatedDataChat: MessageBoxContent[] = apiDataChat.box
      .map((item: any) => {
        let isSeen = false;
        let content = ""; // Mặc định là rỗng nếu không có message
        let detailContent = "";

        // Kiểm tra xem có messageIds hay không
        if (
          item.lastMessage &&
          item.lastMessage.text &&
          item.lastMessage.text.length > 0
        ) {
          content = item.lastMessage.text[item.lastMessage.text.length - 1];
        } else {
          if (
            item.lastMessage &&
            item.lastMessage.contentId &&
            item.lastMessage.contentId.length > 0
          ) {
            const contentType =
              item.lastMessage.contentId[item.lastMessage.contentId.length - 1]
                .type;
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
            isSeen: isSeen
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
          isSeen: isSeen
        };
      })
      .filter((item: any): item is MessageBoxContent => item !== null); // Loại bỏ các giá trị null

    // Lấy danh sách ID của các hộp chat để gửi API check-mark-read
    const messageIdsToCheck = updatedDataChat.map((item) => item.id);

    // Gửi yêu cầu API check-mark-read với các ID này
    const checkReadResponse = await axios.post(
      `${process.env.BASE_URL}message/check-mark-read`,
      {
        boxIds: messageIdsToCheck
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    // Kiểm tra kết quả API và cập nhật lại isSeen trong updatedDataChat
    if (checkReadResponse.status === 200) {
      const checkResults = checkReadResponse.data;
      const updatedSeenDataChat = updatedDataChat.map((item) => {
        const result = checkResults.find(
          (result: { boxId: string }) => result.boxId === item.id
        );
        if (result && result.success) {
          return {
            ...item,
            isSeen: true // Cập nhật trạng thái đã xem
          };
        }
        return item;
      });
      setDataChat(updatedSeenDataChat);
    }
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching messages:", err);
  }
};
