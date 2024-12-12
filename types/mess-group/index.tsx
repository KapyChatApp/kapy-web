import { FileContent, MessageBoxInfo, UserInfoBox } from "@/lib/DTO/message";

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
