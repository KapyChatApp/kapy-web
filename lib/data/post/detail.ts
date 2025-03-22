import { PostResponseDTO } from "@/lib/DTO/post";
import axios from "axios";

export const fetchDetailPost = async (
  postId: string
): Promise<PostResponseDTO | null> => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return null;

  try {
    const { data: post } = await axios.get<PostResponseDTO>(
      `${process.env.BASE_URL}post/apost?postId=${postId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: storedToken
        }
      }
    );

    try {
      const { data: likedIds } = await axios.get(
        `${process.env.BASE_URL}post/like/detail?postId=${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: storedToken
          }
        }
      );

      return { ...post, likedIds: likedIds || [] };
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      return post; // Nếu lỗi khi lấy likes, trả về bài viết mà không có danh sách likes
    }
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    return null;
  }
};
