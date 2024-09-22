import { Icon } from "@iconify/react";
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
