export async function dislikeComment(commentId: string) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("No token found");
      return;
    }
    const response = await fetch(
      `${process.env.BASE_URL}post/comment/dislike?commentId=${commentId}`,
      {
        method: "POST",
        headers: {
          Authorization: storedToken,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to like the post");
    }
    return true;
  } catch (error) {
    console.error("Error liking post:", error);
  }
}
