export interface ResponseUserInfo {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  address: string;
  job: string;
  hobbies: string;
  bio: string;
  birthDay: string;
  attendDate: string;
  relationShip: string;
  flag: boolean;
  friendIds: string[];
  bestFriendIds: string[];
  blockedIds: string[];
  posts: string[];
}

export interface UserResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  phoneNumber: string;
  email: string;
  role: string[];
  avatar: string;
  background: string;
  gender: boolean;
  address: string;
  password: string;
  job: string;
  hobbies: string;
  bio: string;
  point: number;
  relationShip: string;
  birthDay: string;
  attendDate: string;
  flag: boolean;
  friendIds: string[];
  bestFriendIds: string[];
  blockedIds: string[];
  postIds: string[];
  rateIds: string[];
  createAt: string;
  createBy: string;
}

export interface UserUpdateRequest {
  firstName: string;
  lastName: string;
  nickName: string;
  phoneNumber: string;
  email: string;
  password: string;
  rePassword: string;
  gender: boolean; // true = Nam, false = Nữ
  address: string;
  birthDay: string;
}
