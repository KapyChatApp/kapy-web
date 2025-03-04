import { FileResponseDTO } from "./map";

export interface CreateCommentDTO {
  caption: string | undefined;
  userId: string | undefined;
  replyId: string;
  targetType: string;
}

export interface CommentResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  userId: string;
  likedIds: string[];
  replieds: CommentResponseDTO[];
  caption: string;
  createAt: string;
  createBy: string;
  content?: FileResponseDTO;
}
