export async function editComment(
  commentId: string,
  caption: string,
  file?: File | null
) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("No token found");
      return;
    }

    if (!caption.trim() && !file) {
      console.log("Caption or file is required");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);

    if (file) {
      formData.append("content", file);
    }

    const response = await fetch(
      `${process.env.BASE_URL}post/comment/edit?commentId=${commentId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${storedToken}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error("Failed to edit comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing comment:", error);
  }
}
