import { CommentResponseDTO } from "./comment";
import { FileResponseDTO } from "./map";
import { ShortUserResponseDTO } from "./user";

interface LikeInformation {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface PostResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  userId: string;
  likedIds: ShortUserResponseDTO[];
  shares: PostResponseDTO[];
  comments: CommentResponseDTO[];
  caption: string;
  createAt: string;
  contents: FileResponseDTO[];
}
