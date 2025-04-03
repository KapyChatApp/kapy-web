import { toast } from "@/hooks/use-toast";
import { FileResponseDTO } from "@/lib/DTO/map";
import { PostResponseDTO } from "@/lib/DTO/post";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { createPost } from "@/lib/services/post/create";
import { deletePost } from "@/lib/services/post/delete";
import { getFileFormat } from "@/lib/utils";

export const handleCreate = async (
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
  onBack();
  toast({
    title: `Create post successfully`,
    className:
      "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
  });
  await createPost(caption, files, tagIds);
};

export const handleDelete = async (
  postId: string,
  setPostList: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>
) => {
  const result = await deletePost(postId);
  if (result) {
    setPostList((items) =>
      items.filter((post: PostResponseDTO) => post._id !== postId)
    );
  }
};
