import { UserInfoBox } from "@/lib/DTO/message";
import axios from "axios";
interface DetailBox {
  id: string;
  senderId: UserInfoBox;
  receiverIds: UserInfoBox[];
  groupName: string;
  groupAva: string;
  flag: boolean;
  pin: boolean;
  createAt: string;
  createBy: string;
  readStatus: boolean;
}

let detailDataBox: DetailBox = {
  id: "",
  senderId: {
    _id: "",
    firstName: "",
    lastName: "",
    nickName: "",
    avatar: "",
    isOnline: false
  },
  receiverIds: [
    {
      _id: "",
      firstName: "",
      lastName: "",
      nickName: "",
      avatar: "",
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
      _id: apiDataBox.box.senderId._id,
      firstName: apiDataBox.box.senderId.firstName,
      lastName: apiDataBox.box.senderId.lastName,
      nickName: apiDataBox.box.senderId.nickName,
      avatar: apiDataBox.box.senderId.avatar,
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
