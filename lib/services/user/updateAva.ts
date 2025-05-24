export async function uploadAvatarClient(file: File, isCreatePost: boolean) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("isCreatePost", isCreatePost.toString());

  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }
    const response = await fetch(
      `${process.env.BASE_URL}media/upload-avatar?isCreatePost=${isCreatePost}`,
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
      throw new Error(errorData.error || "Failed to upload avatar");
    }

    const data = await response.json();
    console.log("Upload success:", data);
    return data;
  } catch (error: any) {
    console.error("Error uploading avatar:", error.message);
    throw error;
  }
}
