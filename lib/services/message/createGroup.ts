import {
  MessageBoxDTO,
  MessageBoxInfo,
  RequestCreateGroup
} from "@/lib/DTO/message";

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
    readStatus: dto.readStatus,
    stranger: dto.stranger
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

    const response = await fetch(
      `${process.env.BASE_URL}message/create-group`,
      {
        method: "POST",
        headers: {
          Authorization: storedToken
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result);
    const data: MessageBoxInfo = transformToMessageBoxInfo(result.data.newBox);
    setDataChat((prev) => [...prev, data]);
    return result;
  } catch (error) {
    console.error("Error creating group:", error);
    return { success: false, message: "Failed to create group" }; // Trả về thông báo lỗi phù hợp
  }
}
