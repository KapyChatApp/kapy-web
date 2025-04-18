export async function editPost(
  postId: string,
  caption: string,
  files: File[] | null,
  tagIds: string[],
  remainContentIds: string[]
) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("No token found");
      return;
    }

    if (!caption.trim() && !files?.length) {
      console.log("Caption or file is required");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("tagIds", JSON.stringify(tagIds));
    formData.append("remainContentIds", JSON.stringify(remainContentIds));

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("file", file);
      });
    }

    const response = await fetch(
      `${process.env.BASE_URL}post/edit?postId=${postId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${storedToken}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error("Failed to edit post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing post:", error);
  }
}
