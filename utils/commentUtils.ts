import { CommentResponseDTO } from "@/lib/DTO/comment";
import { FileResponseDTO } from "@/lib/DTO/map";
import { createComment } from "@/lib/services/post/comment/create";
import { deleteComment } from "@/lib/services/post/comment/delete";
import { dislikeComment } from "@/lib/services/post/comment/dislike";
import { editComment } from "@/lib/services/post/comment/edit";
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
  setLiked(true);
  setLikeCount((prev) => prev + 1);
  try {
    await likeComment(commentId);
  } catch (error) {
    console.error("Lỗi khi like:", error);
    setLiked(false);
    setLikeCount((prev) => Math.max(prev - 1, 0));
  }
};

export const handleDislike = async (
  commentId: string,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  setLikeCount: React.Dispatch<React.SetStateAction<number>>
) => {
  setLiked(false);
  setLikeCount((prev) => Math.max(prev - 1, 0));

  try {
    await dislikeComment(commentId);
  } catch (error) {
    console.error("Lỗi khi dislike:", error);
    setLiked(true);
    setLikeCount((prev) => prev + 1);
  }
};

export const handleUpdate = async (
  setCommentList: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>,
  editingCommentId: string,
  commentContent: string,
  setEditingCommentId: React.Dispatch<React.SetStateAction<string>>,
  setCommentContent: React.Dispatch<React.SetStateAction<string>>,
  setFiles: React.Dispatch<React.SetStateAction<File | null>>,
  files?: File | null
) => {
  setCommentList((prev) =>
    prev.map((c) =>
      c._id === editingCommentId
        ? {
            ...c,
            caption: commentContent,
            content: files
              ? {
                  _id: "",
                  fileName: files.name,
                  url: URL.createObjectURL(files),
                  bytes: files.size,
                  width: 0,
                  height: 0,
                  format: getFileFormat(files.type, files.name),
                  type: files.type.includes("/") ? files.type.split("/")[0] : ""
                }
              : c.content // Giữ nguyên content nếu không có file mới
          }
        : c
    )
  );

  setEditingCommentId("");
  setCommentContent("");
  setFiles(null);

  await editComment(editingCommentId, commentContent, files);
};
