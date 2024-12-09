import { MessageBoxInfo, UserInfoBox } from "@/lib/dataBox";
import { FileContent } from "@/lib/dataMessages";

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
  detailByBox: MessageBoxInfo;
  setItemSent: React.Dispatch<
    React.SetStateAction<UserInfoBox[] | FileContent[]>
  >;
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
  itemSent: UserInfoBox[] | FileContent[];
}
