"use client";
import {
  FileContent,
  MessageBoxInfo,
  ResponseMessageDTO
} from "@/lib/DTO/message";
import { createContext, useContext, useState } from "react";

// Tạo kiểu cho context
interface ChatContextType {
  readStatusByBox: Record<string, boolean>;
  setReadStatusByBox: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  dataChat: MessageBoxInfo[];
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxInfo[]>>;
  dataGroupChat: MessageBoxInfo[];
  setDataGroupChat: React.Dispatch<React.SetStateAction<MessageBoxInfo[]>>;
  fileList: Record<string, FileContent[]>;
  setFileList: React.Dispatch<
    React.SetStateAction<Record<string, FileContent[]>>
  >;
  messagesByBox: Record<string, ResponseMessageDTO[]>;
  setMessagesByBox: React.Dispatch<
    React.SetStateAction<Record<string, ResponseMessageDTO[]>>
  >;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isReactedByMessage: Record<string, boolean>;
  setIsReactedByMessage: React.Dispatch<Record<string, boolean>>;
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
  const [dataGroupChat, setDataGroupChat] = useState<MessageBoxInfo[]>([]);
  const [fileList, setFileList] = useState<Record<string, FileContent[]>>({});
  const [messagesByBox, setMessagesByBox] = useState<
    Record<string, ResponseMessageDTO[]>
  >({});
  const [readStatusByBox, setReadStatusByBox] = useState<
    Record<string, boolean>
  >({});
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
        dataGroupChat,
        setDataGroupChat,
        fileList,
        setFileList,
        messagesByBox,
        setMessagesByBox,
        readStatusByBox,
        setReadStatusByBox,
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
