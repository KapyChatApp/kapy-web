"use client";
import { MessageBoxContent } from "@/lib/dataBox";
import { FileContent, ResponseMessageDTO } from "@/lib/dataMessages";
import { DetailBox } from "@/lib/dataOneBox";
import { createContext, useContext, useState } from "react";
export interface LatestMessage {
  senderName: string;
  content: string;
  createAt: string;
  boxId: string;
}

// Tạo kiểu cho context
interface UserContextType {
  adminId: string;
  setAdminId: React.Dispatch<React.SetStateAction<string>>;
}

// Tạo context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [adminId, setAdminId] = useState<string>("");

  return (
    <UserContext.Provider
      value={{
        adminId,
        setAdminId
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
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
