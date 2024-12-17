import { FileContent } from "@/lib/DTO/message";
import { getFileFormat } from "@/lib/utils";
import axios from "axios";

export async function handleSendTextMessage(
  messageContent: string,
  boxId: string,
  recipientIds: string[] | undefined,
  setMessageContent: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  const recipientId = recipientIds ? recipientIds : [];
  const messageData = {
    boxId: boxId,
    content: messageContent
  };
  if (!messageData.boxId || recipientId.length === 0) {
    setError("Missing required fields in message data");
    console.error("Missing required fields in message data");
    return;
  }
  if (messageContent !== "") {
    const formData = new FormData();
    formData.append("boxId", messageData.boxId);
    formData.append("content", JSON.stringify(messageData.content));

    // Gửi API
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setError("No token found");
        return;
      }

      const response = await axios.post(
        process.env.BASE_URL + "message/send",
        formData,
        {
          headers: {
            Authorization: `${storedToken}`
          }
        }
      );
      setMessageContent("");
    } catch (error: any) {
      setError(error.message);
      console.error("Error sending message: ", error);
    }
  } else {
    setError("No text in input bar");
    console.log("No text in input bar");
  }
}
