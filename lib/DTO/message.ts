// Interface FE
export interface UserInfoBox {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  phone: string;
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
}
export interface DetailBox {
  id: string;
  senderId: UserInfoBox;
  receiverIds: UserInfoBox[];
  groupName: string;
  groupAva: string;
  flag: boolean;
  pin: boolean;
  createAt: string;
  createBy: string;
  readStatus: boolean;
}

// Interface Response
interface ResponseUserInfoBox {
  _id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  phoneNumber: string;
}
interface MessageBoxDTO {
  _id: string;
  senderId: string | ResponseUserInfoBox;
  receiverIds: ResponseUserInfoBox[];
  groupName: string;
  groupAva: string;
  flag: boolean;
  pin: boolean;
  lastMessage: ResponseMessageDTO;
  readStatus: boolean;
}
export interface ResponseMessageBoxDTO {
  box: MessageBoxDTO[];
  adminId: string;
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
  isReact: boolean;
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
  isReact: boolean;
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
