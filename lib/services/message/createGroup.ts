import {
  MessageBoxDTO,
  MessageBoxInfo,
  RequestCreateGroup
} from "@/lib/DTO/message";
import axios from "axios";

function transformToMessageBoxInfo(dto: MessageBoxDTO): MessageBoxInfo {
  return {
    id: dto._id,
    receiverInfo: {
      _id: dto._id,
      firstName: "",
      lastName: dto.groupName,
      avatar: dto.groupAva,
      nickName: "",
      isOnline: false
    },
    memberInfo: dto.receiverIds,
    groupName: dto.groupName,
    groupAva: dto.groupAva,
    pin: dto.pin,
    stranger: dto.stranger,
    readStatus: false,
    readedId: [],
    createBy: ""
  };
}

export async function createGroup(
  param: RequestCreateGroup,
  groupAva: File | undefined,
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxInfo[]>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setError("No token found");
      return { success: false, message: "No token found" };
    }

    const formData = new FormData();
    formData.append("membersIds", JSON.stringify(param.membersIds));
    formData.append("groupName", param.groupName);

    // Chỉ thêm avatar nếu tồn tại
    if (groupAva) {
      formData.append("file", groupAva);
    }

    const response = await axios.post(
      `${process.env.BASE_URL}message/create-group`,
      formData,
      {
        headers: {
          Authorization: storedToken,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    const result = response.data.result;
    if (result && result.success) {
      const data: MessageBoxInfo = transformToMessageBoxInfo(result.messageBox);
      setDataChat((prev) => [...prev, data]);
    }
    return result;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error response from server:", error.response.data);
      setError(error.response.data.message || "Unknown error");
    } else {
      console.error("Error creating group:", error.message);
      setError("An unexpected error occurred");
    }
    return { success: false, message: "Failed to create group" };
  }
}
