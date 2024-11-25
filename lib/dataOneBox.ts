import { useEffect, useState } from "react";
import axios from "axios";
import { MessageBoxProps } from "@/types/mess-group";
import { formatTimeMessageBox } from "./utils";
import { Group } from "@/types/object";
import { ResponseUserInfo } from "./dataUser";
import { UserInfoBox } from "./dataBox";

export interface DetailBox {
  id: string;
  senderId: UserInfoBox;
  receiverIds: UserInfoBox[];
  groupName: string;
  groupAva: string;
  flag: boolean;
  pin: boolean;
  createAt: string;
  createBy: string;
}

let detailDataBox: DetailBox = {
  id: "",
  senderId: {
    id: "",
    firstName: "",
    lastName: "",
    nickName: "",
    avatar: "",
    phone: ""
  },
  receiverIds: [
    { id: "", firstName: "", lastName: "", nickName: "", avatar: "", phone: "" }
  ],
  groupName: "",
  groupAva: "",
  flag: false,
  pin: false,
  createAt: "",
  createBy: ""
};
let apiDataBox: any;

export const fetchDetailBox = async (boxId: string) => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return detailDataBox;

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

    const senderInfo: UserInfoBox = {
      id: apiDataBox.box.senderId._id,
      firstName: apiDataBox.box.senderId.firstName,
      lastName: apiDataBox.box.senderId.lastName,
      nickName: apiDataBox.box.senderId.nickName,
      avatar: apiDataBox.box.senderId.avatar,
      phone: apiDataBox.box.senderId.phoneNumber
    };

    const recieverInfo: UserInfoBox[] = Array.isArray(
      apiDataBox.box.receiverIds
    )
      ? apiDataBox.box.receiverIds.map((receiver: any) => ({
          id: receiver._id,
          firstName: receiver.firstName,
          lastName: receiver.lastName,
          nickName: receiver.nickName,
          avatar: receiver.avatar,
          phone: receiver.phoneNumber
        }))
      : [];

    // Cập nhật lại detailDataBox với dữ liệu trả về từ API
    detailDataBox = {
      id: apiDataBox.box._id,
      senderId: senderInfo,
      receiverIds: recieverInfo,
      groupName: apiDataBox.box.groupName,
      groupAva: apiDataBox.box.groupAva,
      flag: apiDataBox.box.flag,
      pin: apiDataBox.box.pin,
      createAt: apiDataBox.box.createAt,
      createBy: apiDataBox.box.createBy
    };
    return detailDataBox;
  } catch (err: any) {
    console.error("Error fetching messages:", err);
    return detailDataBox;
  }
};
