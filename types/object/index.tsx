import { Photo } from "../media";

export interface User {
  id: string;
  name: string;
  ava: string;
  background: string;
  image: Photo[];
  mutualFriend: number;
  mutualGroup: number;
  status: string;
  birth: Date;
  bio: string;
  phone: string;
}

export interface Group {
  id: string;
  name: string;
  ava: string;
  createdAt: string;
  createdBy: User;
  members: MememberGroup[];
}

export interface MememberGroup {
  id: string;
  username: string;
  ava: string;
  addedBy: string;
  isOnline: boolean;
}
