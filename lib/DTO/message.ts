// Interface FE
export interface UserInfoBox {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  isOnline: boolean;
}
export interface MessageBoxInfo {
  id: string;
  receiverInfo: UserInfoBox;
  memberInfo: UserInfoBox[];
  groupName: string;
  groupAva: string;
  pin: boolean;
  readStatus: boolean;
  stranger: boolean;
}

export interface RequestCreateGroup {
  membersIds: string[];
  groupName: string;
}
// Interface Response
export interface MessageBoxDTO {
  _id: string;
  senderId: string;
  receiverIds: UserInfoBox[];
  groupName: string;
  groupAva: string;
  flag: boolean;
  pin: boolean;
  readStatus: boolean;
  stranger: boolean;
}

export interface FileContent {
  fileName: string;
  url: string;
  publicId: string;
  bytes: string;
  width: string;
  height: string;
  format: string;
  type: string;
}
export interface GPSContent {
  type: "gps";
  latitude: number;
  longitude: number;
  description?: string;
}
export interface ResponseMessageDTO {
  id: string;
  flag: boolean;
  readedId: string[];
  contentId: FileContent;
  text: string;
  boxId: string;
  createAt: string;
  createBy: string;
}

export interface PusherRevoke {
  id: string;
  flag: boolean;
  isReact: string[];
  text: string;
  boxId: string;
  action: string;
  createAt: string;
  createBy: string;
}
export interface PusherDelete {
  id: string;
  flag: boolean;
  visibility: boolean;
  isReact: string[];
  text: string;
  boxId: string;
  action: string;
  createAt: string;
  createBy: string;
}
export interface TextingEvent {
  boxId: string;
  userId: string;
  avatar: string;
  texting: boolean;
}
