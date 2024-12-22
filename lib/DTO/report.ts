export interface IPost {
  userId: string;
  likedIds: string[];
  shares: string[];
  comments: string[];
  caption: string;
  contentIds: string[];
  flag: boolean;
}

export interface IUser {
  firstName: string;
  lastName: string;
  nickName: string;
  phoneNumber: string;
  email: string;
  password: string;
  roles: string[];
  avatar: string;
  avatarPublicId: string;
  background: string;
  backgroundPublicId: string;
  gender: boolean;
  address: string;
  job: string;
  hobbies: string;
  bio: string;
  point: number;
  relationShip: string;
  birthDay: Date;
  attendDate: Date;
  flag: boolean;
  friendIds: string[];
  bestFriendIds: string[];
  blockedIds: string[];
  postIds: string[];
  rateIds: string[];
}

export interface ReportResponseDTO {
  _id: string;
  content: string;
  flag: boolean;
  status: string;
  userId: string;
  target: IPost | IUser;
}

export interface CreateReportDTO {
  title: string;
  content: string;
  targetId: string;
  targetType: string;
}

export interface UpdateReportDTO {
  content: string;
}

export interface VerifyReportDTO {
  status: string;
}
