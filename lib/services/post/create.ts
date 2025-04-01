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
      files.forEach((file) => {
        formData.append("file", file);
      });
    }
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });

    const response = await fetch(`${process.env.BASE_URL}post/add`, {
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
