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

export interface MememberGroup {
  id: string;
  username: string;
  ava: string;
  addedBy: string;
  isOnline: boolean;
}
