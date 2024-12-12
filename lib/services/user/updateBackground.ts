export async function uploadBackgroundClient(
  file: File
): Promise<{ status: boolean; message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }
    const response = await fetch(
      `${process.env.BASE_URL}media/upload-background`,
      {
        method: "POST",
        headers: {
          Authorization: `${storedToken}` // Nếu API yêu cầu token xác thực
        },
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload background");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error uploading background:", error.message);
    throw error;
  }
}
