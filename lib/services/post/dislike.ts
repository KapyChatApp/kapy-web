export async function dislikePost(postId: string) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("No token found");
      return;
    }
    const response = await fetch(
      `${process.env.BASE_URL}post/dislike?postId=${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to dislike the post");
    }
    return true;
  } catch (error) {
    console.error("Error liking post:", error);
  }
}
