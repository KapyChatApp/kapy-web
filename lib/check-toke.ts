export async function checkTokenFrontend(
  token: string
): Promise<{ isAuthenticated: boolean }> {
  try {
    const response = await fetch(`${process.env.BASE_URL}auth/check-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Giả sử `result` là { isAuthenticated: boolean }
  } catch (error) {
    console.error("Error checking token:", error);
    return { isAuthenticated: false }; // Trả về kiểu phù hợp với kiểu đã khai báo
  }
}
