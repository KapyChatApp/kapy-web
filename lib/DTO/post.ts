import { CommentResponseDTO } from "./comment";
import { FileResponseDTO } from "./map";

export interface PostResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  userId: string;
  likedIds: string[];
  shares: PostResponseDTO[];
  comments: CommentResponseDTO[];
  caption: string;
  createAt: string;
  contents: FileResponseDTO[];
}
