import { Files, Links, Photo, Video } from "../media";
import { MememberGroup } from "../object";

export interface ImageContent {
  type: "image";
  url: string;
  altText?: string;
}
export interface LinkContent {
  type: "link";
  url: string;
  title?: string;
}
export interface FileContent {
  type: "file";
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export interface SegmentMessProps {
  groupId?: string;
  userId: string;
  userName: string;
  ava: string;
  content: string | ImageContent | LinkContent | FileContent;
  time: Date;
  recipientId?: string[];
}

export interface MessageBoxProps {
  id: string;
  otherName: string;
  otherId: string;
  sender: string;
  ava: string;
  content?: string;
  pin: boolean;
  time: string;
  isOnline: boolean;
  isSeen: boolean;
}

export interface ManagementGroup {
  id: string;
  label: string;
}

export interface RightTopProps {
  ava: string;
  name: string;
  membersGroup: number;
  onlineGroup: number;
  openMore: boolean;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Actions {
  icon: string;
  label: string;
  click: string;
}

export interface MoreTopProps {
  ava: string;
  name: string;
}

export interface ActiveComponentProps {
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
}

export interface SeeAllProps {
  setItemSent: React.Dispatch<
    React.SetStateAction<
      MememberGroup[] | Photo[] | Video[] | Files[] | Links[]
    >
  >;
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
  itemSent: MememberGroup[] | Photo[] | Video[] | Files[] | Links[];
}

export interface StateType {
  isNotified: boolean;
  isFind: boolean;
  isBest: boolean;
  isBlock: boolean;
  isAdd: boolean;
  isManage: boolean;
}
