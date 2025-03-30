import { PostResponseDTO } from "@/lib/DTO/post";
import axios from "axios";

export const fetchPosts = async (
  page: number,
  limit: number = 10
): Promise<PostResponseDTO[]> => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return [];

  try {
    // Gọi API lấy danh sách bài viết
    const response = await axios.get(
      `${process.env.BASE_URL}social/personal?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );

    const posts: PostResponseDTO[] = response.data;

    // Gọi API `post/like/detail` cho từng bài viết
    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          const likeResponse = await axios.get(
            `${process.env.BASE_URL}post/like/detail?postId=${post._id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${storedToken}`
              }
            }
          );

          return {
            ...post,
            likedIds: likeResponse.data || [] // Gán danh sách likedIds từ API
          };
        } catch (error) {
          console.error(`Error fetching likes for post ${post._id}:`, error);
          return post; // Trả về post ban đầu nếu có lỗi
        }
      })
    );

    return updatedPosts;
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
};
