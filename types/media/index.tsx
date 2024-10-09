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

export interface Files {
  id: string;
  fileName: string;
  icon: string;
  type: string;
  path: string;
  createAt: Date;
  createBy: string;
}

export interface Links {
  id: string;
  linkName: string;
  icon: string;
  type: string;
  path: string;
  createAt: Date;
  createBy: string;
}
