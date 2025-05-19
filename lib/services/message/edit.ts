import axios from "axios";

interface EditMessageParams {
  messageId: string;
  newContent: string;
  userHangup?: string;
}

export async function editMessage({
  messageId,
  newContent,
  userHangup
}: EditMessageParams): Promise<boolean> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      return false;
    }

    const response = await axios.post(
      `${process.env.BASE_URL}message/edit`,
      { messageId, newContent, userHangup },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    if (response.status === 200 && response.data.success !== false) {
      console.log("Message updated successfully");
      return true;
    }

    console.warn("Failed to update message:", response.data);
    return false;
  } catch (error) {
    console.error("Error editing message:", error);
    return false;
  }
}
