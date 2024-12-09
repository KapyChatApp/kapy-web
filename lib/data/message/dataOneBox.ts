import { DetailBox, UserInfoBox } from "@/lib/DTO/message";
import axios from "axios";

let detailDataBox: DetailBox = {
  id: "",
  senderId: {
    id: "",
    firstName: "",
    lastName: "",
    nickName: "",
    avatar: "",
    phone: "",
    isOnline: false
  },
  receiverIds: [
    {
      id: "",
      firstName: "",
      lastName: "",
      nickName: "",
      avatar: "",
      phone: "",
      isOnline: false
    }
  ],
  groupName: "",
  groupAva: "",
  flag: false,
  pin: false,
  createAt: "",
  createBy: "",
  readStatus: false
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
      phone: apiDataBox.box.senderId.phoneNumber,
      isOnline: false
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
      createBy: apiDataBox.box.createBy,
      readStatus: apiDataBox.box.readStatus
    };
    return detailDataBox;
  } catch (err: any) {
    console.error("Error fetching messages:", err);
    return detailDataBox;
  }
};
