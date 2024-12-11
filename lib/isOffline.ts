export async function isOffline(
  token: string
): Promise<{ userId: string; online: boolean }> {
  try {
    const response = await fetch(`${process.env.BASE_URL}user/offline`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data"
      },
      keepalive: true
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Giả sử `result` là { isAuthenticated: boolean }
  } catch (error) {
    console.error("Error checking token:", error);
    return { userId: "", online: false }; // Trả về kiểu phù hợp với kiểu đã khai báo
  }
}
