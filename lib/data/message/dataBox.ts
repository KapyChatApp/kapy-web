// import { MessageBoxDTO, MessageBoxInfo, UserInfoBox } from "@/lib/DTO/message";
// import axios from "axios";

// export const fetchMessageBox = async (
//   adminId: string,
//   setError: React.Dispatch<React.SetStateAction<string>>
// ) => {
//   const storedToken = localStorage.getItem("token");
//   if (!storedToken) {
//     setError("No token found");
//     return;
//   }

//   try {
//     const responseChat = await axios.get(
//       `${process.env.BASE_URL}message/all-box-chat`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${storedToken}`
//         }
//       }
//     );

//     const apiDataChat = responseChat.data;
//     if (!apiDataChat.success) {
//       return [];
//     }
//     const sortedApiDataChat: MessageBoxDTO[] = apiDataChat.box.sort(
//       (a: any, b: any) => {
//         if (a.lastMessage && b.lastMessage) {
//           const timeA = new Date(a.lastMessage.createAt || 0).getTime();
//           const timeB = new Date(b.lastMessage.createAt || 0).getTime();
//           return timeB - timeA;
//         }
//         if (!a.lastMessage) return 1;
//         if (!b.lastMessage) return -1;
//         return 0;
//       }
//     );

//     // Xử lý dữ liệu từ response để tạo ra dataChat
//     const updatedDataChat: MessageBoxInfo[] = sortedApiDataChat
//       .map((item) => {
//         const receiver = item.receiverIds.find(
//           (receiver) => receiver._id !== adminId
//         );
//         let receiverInfo: UserInfoBox;
//         if (receiver) {
//           receiverInfo = {
//             _id: receiver._id,
//             firstName: receiver.firstName,
//             lastName: receiver.lastName,
//             avatar: receiver.avatar,
//             nickName: receiver.nickName,
//             isOnline: false
//           };
//         } else {
//           receiverInfo = {
//             _id: "",
//             firstName: "Unknown",
//             lastName: "",
//             avatar: "/assets/ava/default.png",
//             nickName: "",
//             isOnline: false
//           };
//         }
//         return {
//           id: item._id,
//           receiverInfo: receiverInfo,
//           memberInfo: item.receiverIds,
//           groupName: "",
//           groupAva: "",
//           pin: false,
//           readStatus: item.readStatus,
//           stranger: item.stranger
//         };
//       })
//       .filter((item): item is MessageBoxInfo => item !== null);
//     return updatedDataChat;
//   } catch (err: any) {
//     setError(err.message);
//     console.error("Error fetching messages:", err);
//   }
// };

import { MessageBoxDTO, MessageBoxInfo, UserInfoBox } from "@/lib/DTO/message";
import axios from "axios";

export const fetchMessageBox = async (
  adminId: string,
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxInfo[]>>,
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

    const apiDataChat = responseChat.data;

    const sortedApiDataChat: MessageBoxDTO[] = apiDataChat.box.sort(
      (a: any, b: any) => {
        if (a.lastMessage && b.lastMessage) {
          const timeA = new Date(a.lastMessage.createAt || 0).getTime();
          const timeB = new Date(b.lastMessage.createAt || 0).getTime();
          return timeB - timeA;
        }
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return 0;
      }
    );

    // Xử lý dữ liệu từ response để tạo ra dataChat
    const updatedDataChat: MessageBoxInfo[] = sortedApiDataChat
      .map((item) => {
        const receiver = item.receiverIds.find(
          (receiver) => receiver._id !== adminId
        );
        let receiverInfo: UserInfoBox;
        if (receiver) {
          receiverInfo = {
            _id: receiver._id,
            firstName: receiver.firstName,
            lastName: receiver.lastName,
            avatar: receiver.avatar,
            nickName: receiver.nickName,
            isOnline: false
          };
        } else {
          receiverInfo = {
            _id: "",
            firstName: "Unknown",
            lastName: "",
            avatar: "/assets/ava/default.png",
            nickName: "",
            isOnline: false
          };
        }
        return {
          id: item._id,
          receiverInfo: receiverInfo,
          memberInfo: item.receiverIds,
          groupName: "",
          groupAva: "",
          pin: false,
          readStatus: item.readStatus,
          stranger: item.stranger
        };
      })
      .filter((item): item is MessageBoxInfo => item !== null);
    setDataChat(updatedDataChat);
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching messages:", err);
  }
};
