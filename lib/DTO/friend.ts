export interface FriendResponseDTO {
  _id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  nickName: string;
  mutualFriends: number;
}

export interface FriendProfileResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  phoneNumber: string;
  email: string;
  avatar: string;
  background: string;
  gender: boolean;
  address: string;
  job: string;
  hobbies: string;
  bio: string;
  point: number;
  relationShip: string;
  birthDay: Date;
  attendDate: Date;
  relation: string;
  mutualFriends: number;
}

export interface RequestedResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  relation: string;
  createAt: string;
  mutualFriends: number;
}

export interface FindUserDTO {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  relation: string;
  mutualFriends: number;
}

export interface FriendRequestDTO {
  sender: string;
  receiver: string;
}
