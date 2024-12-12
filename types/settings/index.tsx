import { UserResponseDTO } from "@/lib/DTO/user";

export interface PersonalItemProps {
  personal: UserResponseDTO;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SidebarSettingButton {
  icon: string;
  label: string;
  value: string;
}

export interface LeftSidbarSettingProps {
  setRenderRight: React.Dispatch<React.SetStateAction<string>>;
  renderRight: string;
}

export interface SettingItemProps {
  icon: string;
  title: string;
  description: string;
}

export interface SelectionContent {
  label: string;
  value: string;
}
