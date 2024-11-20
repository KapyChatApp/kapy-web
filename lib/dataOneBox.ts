import { useEffect, useState } from "react";
import axios from "axios";
import { MessageBoxProps } from "@/types/mess-group";
import { formatTimeMessageBox } from "./utils";
import { Group } from "@/types/object";
import { UserInfo } from "./dataUser";

export interface detailBox {
  id: string;
  senderId: UserInfo;
  receiverIds: UserInfo[]; // Giả sử recieverIds là mảng
  groupName: string;
  groupAva: string;
  flag: boolean;
  pin: boolean;
  createAt: string;
  createBy: string;
}

let detailDataBox: detailBox | null = null; // Khởi tạo null để tránh lỗi undefined
let apiDataBox: any;

export const fetchDetailBox = async (boxId: string) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return;

  try {
    const responseChat = await axios.get(
      `${process.env.BASE_URL}message/get-info-box-chat?boxId=${boxId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    apiDataBox = responseChat.data;

    const senderInfo: UserInfo = {
      id: apiDataBox.box.box.senderId._id,
      fullName: apiDataBox.box.box.senderId.fullName,
      nickName: apiDataBox.box.box.senderId.nickName,
      avatar: apiDataBox.box.box.senderId.avatar,
      email: apiDataBox.box.box.senderId.email,
      phoneNumber: apiDataBox.box.box.senderId.phoneNumber,
      address: apiDataBox.box.box.senderId.address,
      job: apiDataBox.box.box.senderId.job,
      hobbies: apiDataBox.box.box.senderId.hobbies,
      bio: apiDataBox.box.box.senderId.bio,
      birthDay: apiDataBox.box.box.senderId.birthDay,
      attendDate: apiDataBox.box.box.senderId.attendDate,
      relationShip: apiDataBox.box.box.senderId.relationShip,
      flag: apiDataBox.box.box.senderId.flag,
      friendIds: apiDataBox.box.box.senderId.friendIds,
      bestFriendIds: apiDataBox.box.box.senderId.bestFriendIds,
      blockedIds: apiDataBox.box.box.senderId.blockedIds,
      posts: apiDataBox.box.box.senderId.posts
    };

    const recieverInfo: UserInfo[] = Array.isArray(
      apiDataBox.box.box.receiverIds
    )
      ? apiDataBox.box.box.receiverIds.map((receiver: any) => ({
          id: receiver._id,
          fullName: receiver.fullName,
          nickName: receiver.nickName,
          avatar: receiver.avatar,
          email: receiver.email,
          phoneNumber: receiver.phoneNumber,
          address: receiver.address,
          job: receiver.job,
          hobbies: receiver.hobbies,
          bio: receiver.bio,
          birthDay: receiver.birthDay,
          attendDate: receiver.attendDate,
          relationShip: receiver.relationShip,
          flag: receiver.flag,
          friendIds: receiver.friendIds,
          bestFriendIds: receiver.bestFriendIds,
          blockedIds: receiver.blockedIds,
          posts: receiver.posts
        }))
      : [];

    // Cập nhật lại detailDataBox với dữ liệu trả về từ API
    detailDataBox = {
      id: apiDataBox.box.box._id,
      senderId: senderInfo,
      receiverIds: recieverInfo,
      groupName: apiDataBox.box.box.groupName,
      groupAva: apiDataBox.box.box.groupAva,
      flag: apiDataBox.box.box.flag,
      pin: apiDataBox.box.box.pin,
      createAt: apiDataBox.box.box.createAt,
      createBy: apiDataBox.box.box.createBy
    };
  } catch (err: any) {
    console.error("Error fetching messages:", err);
    setError(err.message);
  }
};

// Hàm để xử lý lỗi
function setError(message: any) {
  console.error(message);
}

// Dữ liệu trả về
export { detailDataBox, apiDataBox };
