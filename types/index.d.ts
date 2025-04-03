import { UserResponseDTO } from "@/lib/DTO/user";

export interface SidebarLink {
  icon: string;
  route: string;
  label: string;
}

export type SocketUser = {
  userId: string;
  socketId: string;
  profile: UserResponseDTO;
};

export type Participants = {
  caller: SocketUser;
  receiver: SocketUser;
};

export type OngoingCall = {
  participants: Participants;
  isRinging: boolean;
};
