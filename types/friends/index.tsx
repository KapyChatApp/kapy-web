import { Photo } from "../media";

export interface OtherBoxButtonProps {
  icon: string;
  label: string;
}

export interface StrangeFriend {
  id: string;
  name: string;
  ava: string;
  background: string;
  image: Photo[];
  mutualFriend: number;
  mutualGroup: number;
  status: string;
  birth: Date;
  bio: string;
  phone: string;
}

export interface HistoryFindFriend {
  id: string;
  name: string;
  ava: string;
  background: string;
  image: Photo[];
  mutualFriend: number;
  mutualGroup: number;
  status: string;
  birth: Date;
  bio: string;
  phone: string;
}

export interface ConfirmModalProps {
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
  listId: string;
  name: string;
  action: string;
}
