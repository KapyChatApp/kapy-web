import {
  FindUserDTO,
  FriendProfileResponseDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";
import { UserResponseDTO } from "@/lib/DTO/user";

// types.ts
export type AccountData =
  | { type: "self"; data: UserResponseDTO }
  | { type: "friend"; data: FriendProfileResponseDTO };
