import { FileResponseDTO } from "@/lib/DTO/map";
import { urlToFile } from "@/lib/utils";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function editPost(
  postId: string,
  caption: string,
  files: File[] | null,
  tagIds: string[],
  remainContents: FileResponseDTO[]
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

    const remainIds = remainContents.map((c) => c._id);

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("tagIds", JSON.stringify(tagIds));
    formData.append("remainContentIds", JSON.stringify(remainIds));

    const oldFiles = await Promise.all(
      remainContents.map((c, idx) =>
        urlToFile(
          c.url,
          `old-${idx}.${c.type === "Image" ? "jpg" : "mp4"}`,
          c.type === "Image" ? "image/jpeg" : "video/mp4"
        )
      )
    );
    const allFiles = [...oldFiles, ...(files ?? [])];
    const validFiles = allFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`❌ File "${file.name}" vượt quá 10MB (size: ${file.size})`);
        return false;
      }
      return true;
    });
    validFiles.forEach((file) => {
      formData.append("file", file);
    });

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
