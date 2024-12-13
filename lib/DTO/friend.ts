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
