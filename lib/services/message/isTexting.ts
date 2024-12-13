import { TextingEvent } from "@/lib/DTO/message";

export async function isTexting(
  token: string,
  boxId: string,
  avatar: string
): Promise<TextingEvent> {
  try {
    const response = await fetch(`${process.env.BASE_URL}message/texting`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ boxId, avatar })
    });

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