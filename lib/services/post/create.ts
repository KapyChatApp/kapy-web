const MAX_FILE_SIZE = 10 * 1024 * 1024;
export async function createPost(
  caption: string,
  files: File[] | null,
  tagIds: string[]
) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("No token found");
      return;
    }

    // Kiểm tra nếu caption rỗng và không có file
    if (!caption.trim() && !files?.length) {
      console.log("Caption or file is required");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("tagIds", JSON.stringify(tagIds)); // Chuyển thành JSON string

    if (files) {
      const validFiles = files.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          alert(`❌ File "${file.name}" vượt quá 10MB (size: ${file.size})`);
          return false;
        }
        return true;
      });
      validFiles.forEach((file) => {
        formData.append("file", file);
      });
    }

    const response = await fetch(`${process.env.BASE_URL}post/create`, {
      method: "POST",
      headers: {
        Authorization: `${storedToken}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
