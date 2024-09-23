import { Icon } from "@iconify/react";
import { StringToBoolean } from "class-variance-authority/types";
export interface SidebarLink {
  icon: string;
  route: string;
  label: string;
}

export interface SidebarButton {
  icon: string;
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface User {
  id: string;
  name: string;
  ava: string;
  background: string;
}

export interface Group {
  id: string;
  name: string;
  ava: string;
  createdAt: string;
  createdBy: User;
  members: MememberGroup[];
}

export interface MessageBox {
  id: string;
  username: string;
  userId: string;
  ava: string;
  content: string;
  sender: string;
  pin: boolean;
  time: string;
  isOnline: boolean;
  isSeen: boolean;
}

export interface Photo {
  id: string;
  fileName: string;
  path: string;
  size: number;
  createAt: Date;
  createBy: string;
}

export interface Video {
  id: string;
  fileName: string;
  path: string;
  size: number;
  createAt: Date;
  createBy: string;
}

export interface File {
  id: string;
  fileName: string;
  icon: string;
  type: string;
  path: string;
  createAt: Date;
  createBy: string;
}

export interface Link {
  id: string;
  linkName: string;
  icon: string;
  type: string;
  path: string;
  createAt: Date;
  createBy: string;
}

export interface MememberGroup {
  id: string;
  username: string;
  ava: string;
  addedBy: string;
  isOnline: boolean;
}

export interface ManagementGroup {
  id: string;
  label: string;
}
