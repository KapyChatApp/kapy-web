import { FileResponseDTO } from "@/lib/DTO/map";

export async function createComment(
  caption: string,
  files: File | null,
  replyId: string,
  targetType: string
) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("No token found");
      return;
    }
    // Kiểm tra nếu caption rỗng hoặc chỉ có khoảng trắng
    if (!caption.trim() && !files) {
      console.log("Caption or file is required");
      return;
    }
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("replyId", replyId);
    formData.append("targetType", targetType);

    if (files) {
      formData.append("file", files);
    }
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
    const response = await fetch(
      `${process.env.BASE_URL}post/comment/add?replyId=${replyId}&targetType=${targetType}`,
      {
        method: "POST",
        headers: {
          Authorization: `${storedToken}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating comment:", error);
  }
}
