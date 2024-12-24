export interface ShortUserResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
}

export interface FriendResponseDTO {
  _id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  nickName: string;
  mutualFriends: ShortUserResponseDTO[];
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
  mutualFriends: ShortUserResponseDTO[];
}

export interface RequestedResponseDTO {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  relation: string;
  createAt: string;
  mutualFriends: ShortUserResponseDTO[];
}

export interface FindUserDTO {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  relation: string;
  status: boolean;
  mutualFriends: ShortUserResponseDTO[];
}

export interface FriendRequestDTO {
  sender: string;
  receiver: string;
}
