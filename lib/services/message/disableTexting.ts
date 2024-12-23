export interface TextingEvent {
  boxId: string;
  userId: string;
  avatar: string;
  texting: boolean;
}
export async function disableTexting(
  boxId: string,
  avatar: string
): Promise<TextingEvent> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken)
      return { boxId: "", userId: "", avatar: "", texting: false };
    const response = await fetch(
      `${process.env.BASE_URL}message/disable-texting`,
      {
        method: "POST",
        headers: {
          Authorization: storedToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ boxId, avatar })
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Giả sử `result` là { isAuthenticated: boolean }
  } catch (error) {
    console.error("Error checking token:", error);
    return { boxId: "", userId: "", avatar: "", texting: false }; // Trả về kiểu phù hợp với kiểu đã khai báo
  }
}
