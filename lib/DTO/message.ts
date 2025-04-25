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
  stranger: boolean;
  readStatus: boolean;
  readedId: string[];
  createBy: string;
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
  flag: string[];
  pin: boolean;
  stranger: boolean;
  readStatus: boolean;
  readedId: string[];
  createBy: string;
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
  isReact: string[];
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

export interface ResponseReactMessageDTO {
  id: string;
  boxId: string;
  isReact: string[];
}

export interface ReadedStatusPusher {
  success: boolean;
  readedId: string[];
  boxId: string;
}

export interface DetailCalling {
  type: string; // "video", "audio"
  status: string; // "missed", "rejected", "completed"
  duration: string;
  isGroup: boolean;
  participants: string[];
}
