import axios from "axios";

export async function handleSendTextMessage(
  messageContent: string,
  boxId: string,
  recipientIds: string[] | undefined,
  caller?: string,
  setMessageContent?: React.Dispatch<React.SetStateAction<string>>,
  setError?: React.Dispatch<React.SetStateAction<string>>
) {
  const recipientId = recipientIds ? recipientIds : [];
  const messageData = {
    boxId: boxId,
    content: messageContent,
    caller: caller
  };
  if (!messageData.boxId || recipientId.length === 0) {
    setError && setError("Missing required fields in message data");
    console.error("Missing required fields in message data");
    return;
  }
  if (messageContent !== "") {
    const formData = new FormData();
    formData.append("boxId", messageData.boxId);
    formData.append("content", JSON.stringify(messageData.content));
    messageData.caller && formData.append("caller", messageData.caller);

    // Gửi API
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setError && setError("No token found");
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
      if (response.status === 200 && response.data.success !== false) {
        localStorage.setItem("editedMessageId", response.data.sendMessage.id);
      }
      setMessageContent && setMessageContent("");
    } catch (error: any) {
      setError && setError(error.message);
      console.error("Error sending message: ", error);
    }
  } else {
    setError && setError("No text in input bar");
    console.log("No text in input bar");
  }
}
