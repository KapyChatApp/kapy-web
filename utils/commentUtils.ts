import { CommentResponseDTO } from "@/lib/DTO/comment";
import { FileResponseDTO } from "@/lib/DTO/map";
import { createComment } from "@/lib/services/post/comment/create";
import { deleteComment } from "@/lib/services/post/comment/delete";
import { dislikeComment } from "@/lib/services/post/comment/dislike";
import { likeComment } from "@/lib/services/post/comment/like";
import { getFileFormat } from "@/lib/utils";

export const handleCreate = async (
  replyId: string,
  targetType: string,
  commentContent: string,
  files: File | null,
  adminInfo: any,
  setNewComment: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>,
  setCommentContent: (content: string) => void,
  setFiles: (file: File | null) => void
) => {
  const parsedFile: FileResponseDTO | undefined = files
    ? {
        _id: "",
        fileName: files?.name || "",
        url: files ? URL.createObjectURL(files) : "",
        bytes: files?.size || 0,
        width: 0,
        height: 0,
        format: getFileFormat(files?.type || "", files?.name || ""),
        type: files?.type.split("/")[0] || ""
      }
    : undefined;

  const newCmt: CommentResponseDTO = {
    _id: "",
    firstName: adminInfo.firstName,
    lastName: adminInfo.lastName,
    nickName: adminInfo.nickName,
    avatar: adminInfo.avatar,
    userId: adminInfo._id,
    likedIds: [],
    replieds: [],
    caption: commentContent,
    createAt: new Date().toISOString(),
    createBy: adminInfo._id,
    content: parsedFile
  };
  if (targetType === "post") {
    setNewComment((prev: CommentResponseDTO[]) => [...prev, newCmt]);
  } else {
    // Thêm reply vào comment cha
    setNewComment((prev) =>
      prev.map((comment) =>
        comment._id === replyId
          ? { ...comment, replieds: [...comment.replieds, newCmt] }
          : comment
      )
    );
  }
  const result = await createComment(
    commentContent,
    files,
    replyId,
    targetType
  );

  if (result) {
    setCommentContent("");
    setFiles(null);
  }
};

export const handleDelete = async (
  commentId: string,
  setListComment: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>
) => {
  const result = await deleteComment(commentId);
  if (result) {
    setListComment((items) =>
      items.filter((cmt: CommentResponseDTO) => cmt._id !== commentId)
    );
  }
};

export const handleLike = async (
  commentId: string,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  setLikeCount: React.Dispatch<React.SetStateAction<number>>
) => {
  // Cập nhật UI ngay lập tức
  setLiked(true);
  setLikeCount((prev) => prev + 1);

  // Gửi request API
  try {
    await likeComment(commentId);
  } catch (error) {
    console.error("Lỗi khi like:", error);
    // Nếu API thất bại, rollback lại trạng thái cũ
    setLiked(false);
    setLikeCount((prev) => Math.max(prev - 1, 0));
  }
};

export const handleDislike = async (
  commentId: string,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  setLikeCount: React.Dispatch<React.SetStateAction<number>>
) => {
  // Cập nhật UI ngay lập tức
  setLiked(false);
  setLikeCount((prev) => Math.max(prev - 1, 0));

  // Gửi request API
  try {
    await dislikeComment(commentId);
  } catch (error) {
    console.error("Lỗi khi dislike:", error);
    // Nếu API thất bại, rollback lại trạng thái cũ
    setLiked(true);
    setLikeCount((prev) => prev + 1);
  }
};
