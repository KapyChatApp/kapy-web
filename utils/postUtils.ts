import { toast } from "@/hooks/use-toast";
import { FileResponseDTO } from "@/lib/DTO/map";
import { PostResponseDTO } from "@/lib/DTO/post";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { createPost } from "@/lib/services/post/create";
import { deletePost } from "@/lib/services/post/delete";
import { dislikePost } from "@/lib/services/post/dislike";
import { editPost } from "@/lib/services/post/edit";
import { likePost } from "@/lib/services/post/like";
import { getFileFormat } from "@/lib/utils";

export const handleCreatePost = async (
  caption: string,
  files: File[] | null,
  tags: ShortUserResponseDTO[],
  onBack: () => void
) => {
  // const newPost: PostResponseDTO = {
  //   _id: "",
  //   firstName: adminInfo.firstName,
  //   lastName: adminInfo.lastName,
  //   nickName: adminInfo.nickName,
  //   avatar: adminInfo.avatar,
  //   userId: adminInfo._id,
  //   likedIds: [],
  //   shares: [],
  //   comments: [],
  //   caption,
  //   createAt: new Date().toISOString(),
  //   contents: parsedFile,
  //   tags: tags
  // };
  const tagIds = tags.map((item) => item._id);
  const response = await createPost(caption, files, tagIds);
  if (!response) {
    toast({
      title: `Error in creation`,
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
  onBack();
  toast({
    title: `Create post successfully`,
    className:
      "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
  });
};

export const handleDeletePost = async (
  postId: string,
  setPostList: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>,
  setPostData?: React.Dispatch<React.SetStateAction<PostResponseDTO[] | null>>
) => {
  const result = await deletePost(postId);
  if (result) {
    setPostList((items) =>
      items.filter((post: PostResponseDTO) => post._id !== postId)
    );
    setPostData &&
      setPostData(
        (items) =>
          items && items.filter((post: PostResponseDTO) => post._id !== postId)
      );
  }
};

export const handleReactPost = async (
  liked: boolean,
  post: PostResponseDTO,
  userId: string | null,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  updateLikes?: (newLikedUsers: ShortUserResponseDTO[]) => void
) => {
  let updatedLikes;

  if (liked) {
    setLiked(false);
    updatedLikes = post.likedIds.filter((item) => item._id !== userId);
    await dislikePost(post._id);
  } else {
    setLiked(true);
    updatedLikes = post.likedIds; // Thêm userLike vào danh sách
    await likePost(post._id);
  }
  if (updateLikes) updateLikes(updatedLikes); // Gọi callback để cập nhật Actions
};

export const handleEditPost = async (
  postId: string,
  caption: string,
  files: File[] | null,
  remainContents: FileResponseDTO[],
  tags: ShortUserResponseDTO[],
  onBack: () => void
) => {
  const tagIds = tags.map((item) => item._id);
  const response = await editPost(
    postId,
    caption,
    files,
    tagIds,
    remainContents
  );
  if (!response) {
    toast({
      title: `Error in edition`,
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
  onBack();
  toast({
    title: `Edit post successfully`,
    className:
      "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
  });
};
