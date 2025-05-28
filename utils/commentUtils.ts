import { CommentResponseDTO } from "@/lib/DTO/comment";
import { FileResponseDTO } from "@/lib/DTO/map";
import { createComment } from "@/lib/services/post/comment/create";
import { deleteComment } from "@/lib/services/post/comment/delete";
import { dislikeComment } from "@/lib/services/post/comment/dislike";
import { editComment } from "@/lib/services/post/comment/edit";
import { likeComment } from "@/lib/services/post/comment/like";
import { getFileFormat } from "@/lib/utils";

export const handleCreateComment = async (
  replyId: string,
  targetType: string,
  commentContent: string,
  files: File | null,
  adminInfo: any,
  setNewComment: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>,
  setCommentContent: (content: string) => void,
  setFiles: (file: File | null) => void
) => {
  const tempId = `temp-${Date.now()}`;

  const parsedFile: FileResponseDTO | undefined = files
    ? {
        _id: "",
        fileName: files.name,
        url: URL.createObjectURL(files),
        bytes: files.size,
        width: 0,
        height: 0,
        format: getFileFormat(files.type, files.name),
        type: files.type.split("/")[0]
      }
    : undefined;

  const tempComment: CommentResponseDTO = {
    _id: tempId,
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

  // B1: Hiển thị ngay comment tạm
  setNewComment((prev) => {
    if (targetType === "post") return [...prev, tempComment];
    return prev.map((comment) =>
      comment._id === replyId
        ? { ...comment, replieds: [...comment.replieds, tempComment] }
        : comment
    );
  });

  // B2: Reset input
  setCommentContent("");
  setFiles(null);

  try {
    const created = await createComment(
      commentContent,
      files,
      replyId,
      targetType
    );

    // B3: Cập nhật lại _id cho comment tạm
    setNewComment((prev) => {
      if (targetType === "post") {
        return prev.map((cmt) =>
          cmt._id === tempId ? { ...cmt, _id: created._id } : cmt
        );
      } else {
        return prev.map((cmt) =>
          cmt._id === replyId
            ? {
                ...cmt,
                replieds: cmt.replieds.map((rep) =>
                  rep._id === tempId ? { ...rep, _id: created._id } : rep
                )
              }
            : cmt
        );
      }
    });
  } catch (err) {
    console.error("❌ Lỗi tạo comment:", err);
    // Option: hiển thị lỗi hoặc xoá comment tạm khỏi UI nếu muốn
  }
};

export const handleDeleteComment = async (
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

export const handleLikeComment = async (
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

export const handleDislikeComment = async (
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

export const handleEditComment = async (
  setCommentList: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>,
  editingCommentId: string,
  commentContent: string,
  setEditingCommentId: React.Dispatch<React.SetStateAction<string>>,
  setCommentContent: React.Dispatch<React.SetStateAction<string>>,
  setFiles: React.Dispatch<React.SetStateAction<File | null>>,
  files?: File | null
) => {
  // 1. Cập nhật giao diện tạm thời
  const tempContent = files
    ? {
        _id: "",
        fileName: files.name,
        url: URL.createObjectURL(files),
        bytes: files.size,
        width: 0,
        height: 0,
        format: getFileFormat(files.type, files.name),
        type: files.type.split("/")[0] === "image" ? "Image" : "Video"
      }
    : undefined;
  setCommentList((prev) =>
    prev.map((c) =>
      c._id === editingCommentId
        ? {
            ...c,
            caption: commentContent,
            content: files ? tempContent : c.content
          }
        : c
    )
  );

  setEditingCommentId("");
  setCommentContent("");
  setFiles(null);

  try {
    // 2. Gọi API sửa comment
    const updatedComment = await editComment(
      editingCommentId,
      commentContent,
      files
    );

    // 3. Cập nhật lại comment bằng dữ liệu thật từ backend (có url thật, width, height,...)
    setCommentList((prev) =>
      prev.map((c) =>
        c._id === editingCommentId
          ? {
              ...c,
              caption: updatedComment.caption,
              content: updatedComment.content
            }
          : c
      )
    );
  } catch (err) {
    console.error("❌ Failed to edit comment:", err);
  }
};
