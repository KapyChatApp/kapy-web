"use client";
import { FriendResponseDTO } from "@/lib/DTO/friend";
import { UserResponseDTO } from "@/lib/DTO/user";
import { createContext, useContext, useState } from "react";
export const defaultFriendResponseDTO: FriendResponseDTO = {
  _id: "",
  firstName: "",
  lastName: "",
  nickName: "",
  avatar: "",
  mutualFriends: 0
};

// Tạo kiểu cho context
interface FriendContextType {
  listFriend: FriendResponseDTO[];
  setListFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>;
  listBestFriend: FriendResponseDTO[];
  setListBestFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>;
  listBlockFriend: FriendResponseDTO[];
  setListBlockFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>;
  listSuggestedFriend: FriendResponseDTO[];
  setListSuggestedFriend: React.Dispatch<
    React.SetStateAction<FriendResponseDTO[]>
  >;
  mutualGroup: number;
  setMutualGroup: React.Dispatch<React.SetStateAction<number>>;
}

// Tạo context
const FriendContext = createContext<FriendContextType | undefined>(undefined);

// Provider component
export const FriendProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [listFriend, setListFriend] = useState<FriendResponseDTO[]>([
    defaultFriendResponseDTO
  ]);
  const [listBestFriend, setListBestFriend] = useState<FriendResponseDTO[]>([
    defaultFriendResponseDTO
  ]);
  const [listBlockFriend, setListBlockFriend] = useState<FriendResponseDTO[]>([
    defaultFriendResponseDTO
  ]);
  const [listSuggestedFriend, setListSuggestedFriend] = useState<
    FriendResponseDTO[]
  >([defaultFriendResponseDTO]);
  const [mutualGroup, setMutualGroup] = useState<number>(0);
  return (
    <FriendContext.Provider
      value={{
        listFriend,
        setListFriend,
        listBestFriend,
        setListBestFriend,
        listBlockFriend,
        setListBlockFriend,
        listSuggestedFriend,
        setListSuggestedFriend,
        mutualGroup,
        setMutualGroup
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

// Hook để sử dụng context
export const useFriendContext = (): FriendContextType => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
