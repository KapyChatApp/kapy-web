import { toast } from "@/hooks/use-toast";
import { FileResponseDTO } from "@/lib/DTO/map";
import { PostResponseDTO } from "@/lib/DTO/post";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { createPost } from "@/lib/services/post/create";
import { getFileFormat } from "@/lib/utils";

export const handleCreate = async (
  caption: string,
  files: File[] | null,
  tags: ShortUserResponseDTO[],
  adminInfo: any,
  setPosts: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>,
  setBack: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const parsedFile: FileResponseDTO[] = files
    ? files.map((file) => ({
        _id: "",
        fileName: file.name || "",
        url: URL.createObjectURL(file),
        bytes: file.size || 0,
        width: 0,
        height: 0,
        format: getFileFormat(file.type || "", file.name || ""),
        type: file.type.split("/")[0] || ""
      }))
    : [];

  const newPost: PostResponseDTO = {
    _id: "",
    firstName: adminInfo.firstName,
    lastName: adminInfo.lastName,
    nickName: adminInfo.nickName,
    avatar: adminInfo.avatar,
    userId: adminInfo._id,
    likedIds: [],
    shares: [],
    comments: [],
    caption,
    createAt: new Date().toISOString(),
    contents: parsedFile,
    tags: tags
  };
  setPosts((prev: PostResponseDTO[]) => [...prev, newPost]);
  const tagIds = tags.map((item) => item._id);
  const result = await createPost(caption, files, tagIds);

  if (result) {
    setBack(false);
    toast({
      title: `Create post successfully`,
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
  }
};
