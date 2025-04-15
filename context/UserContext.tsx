"use client";
import { UserResponseDTO } from "@/lib/DTO/user";
import { createContext, useContext, useState } from "react";
export const defaultUserResponseDTO: UserResponseDTO = {
  _id: "",
  firstName: "",
  lastName: "",
  nickName: "",
  phoneNumber: "",
  email: "",
  password: "",
  role: [],
  avatar: "",
  background: "",
  gender: true,
  address: "",
  job: "",
  hobbies: "",
  bio: "",
  point: 0,
  relationShip: "",
  birthDay: "",
  flag: false,
  attendDate: "",
  friendIds: [],
  bestFriendIds: [],
  blockedIds: [],
  postIds: [],
  rateIds: [],
  createAt: "",
  createBy: ""
};

// Tạo kiểu cho context
interface UserContextType {
  adminId: string;
  setAdminId: React.Dispatch<React.SetStateAction<string>>;
  isOnlineChat: Record<string, boolean>;
  setIsOnlineChat: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  timeOfflineChat: Record<string, Date>;
  setTimeOfflineChat: React.Dispatch<
    React.SetStateAction<Record<string, Date>>
  >;
  adminInfo: UserResponseDTO;
  setAdminInfo: React.Dispatch<React.SetStateAction<UserResponseDTO>>;
  newAva: string;
  setNewAva: React.Dispatch<React.SetStateAction<string>>;
}

// Tạo context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [adminId, setAdminId] = useState<string>("");
  const [isOnlineChat, setIsOnlineChat] = useState<Record<string, boolean>>({});
  const [timeOfflineChat, setTimeOfflineChat] = useState<Record<string, Date>>(
    {}
  );
  const [adminInfo, setAdminInfo] = useState<UserResponseDTO>(
    defaultUserResponseDTO
  );
  const [newAva, setNewAva] = useState<string>(adminInfo.avatar);
  return (
    <UserContext.Provider
      value={{
        adminId,
        setAdminId,
        isOnlineChat,
        setIsOnlineChat,
        timeOfflineChat,
        setTimeOfflineChat,
        adminInfo,
        setAdminInfo,
        newAva,
        setNewAva
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
