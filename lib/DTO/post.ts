import { CommentResponseDTO } from "./comment";
import { FileResponseDTO } from "./map";

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
  likedIds: LikeInformation[];
  shares: PostResponseDTO[];
  comments: CommentResponseDTO[];
  caption: string;
  createAt: string;
  contents: FileResponseDTO[];
}
