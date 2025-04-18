"use client";
import {
  FileContent,
  MessageBoxInfo,
  ResponseMessageDTO,
  UserInfoBox
} from "@/lib/DTO/message";
import { UserInfo } from "os";
import { createContext, useContext, useState } from "react";

// Tạo kiểu cho context
interface ChatContextType {
  readStatusByBox: Record<string, boolean>;
  setReadStatusByBox: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  readedIdByBox: Record<string, string[]>;
  setReadedIdByBox: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  dataChat: MessageBoxInfo[];
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxInfo[]>>;
  fileList: Record<string, FileContent[]>;
  setFileList: React.Dispatch<
    React.SetStateAction<Record<string, FileContent[]>>
  >;
  memberList: UserInfoBox[];
  setMemberList: React.Dispatch<React.SetStateAction<UserInfoBox[]>>;
  createBy: string;
  setCreateBy: React.Dispatch<React.SetStateAction<string>>;
  messagesByBox: Record<string, ResponseMessageDTO[]>;
  setMessagesByBox: React.Dispatch<
    React.SetStateAction<Record<string, ResponseMessageDTO[]>>
  >;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isReactedByMessage: Record<string, boolean>;
  setIsReactedByMessage: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;

  isDeleted: boolean;
  setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  isRevoked: boolean;
  setIsRevoked: React.Dispatch<React.SetStateAction<boolean>>;
}

// Tạo context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [dataChat, setDataChat] = useState<MessageBoxInfo[]>([]);
  const [memberList, setMemberList] = useState<UserInfoBox[]>([]);
  const [createBy, setCreateBy] = useState("");
  const [fileList, setFileList] = useState<Record<string, FileContent[]>>({});
  const [messagesByBox, setMessagesByBox] = useState<
    Record<string, ResponseMessageDTO[]>
  >({});
  const [readStatusByBox, setReadStatusByBox] = useState<
    Record<string, boolean>
  >({});
  const [readedIdByBox, setReadedIdByBox] = useState<Record<string, string[]>>(
    {}
  );
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isReactedByMessage, setIsReactedByMessage] = useState<
    Record<string, boolean>
  >({});

  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isRevoked, setIsRevoked] = useState<boolean>(false);
  return (
    <ChatContext.Provider
      value={{
        dataChat,
        setDataChat,
        memberList,
        setMemberList,
        createBy,
        setCreateBy,
        fileList,
        setFileList,
        messagesByBox,
        setMessagesByBox,
        readStatusByBox,
        setReadStatusByBox,
        readedIdByBox,
        setReadedIdByBox,
        isTyping,
        setIsTyping,
        isReactedByMessage,
        setIsReactedByMessage,
        isDeleted,
        setIsDeleted,
        isRevoked,
        setIsRevoked
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook để sử dụng context
export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
