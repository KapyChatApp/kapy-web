"use client";
import { MessageBoxInfo } from "@/lib/dataBox";
import { FileContent, ResponseMessageDTO } from "@/lib/dataMessages";
import { DetailBox } from "@/lib/dataOneBox";
import { TextingEvent } from "@/lib/isTexting";
import { createContext, useContext, useState } from "react";

// Tạo kiểu cho context
interface ChatContextType {
  readStatusByBox: Record<string, boolean>;
  setReadStatusByBox: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  dataChat: MessageBoxInfo[];
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxInfo[]>>;
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
}

// Tạo context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [dataChat, setDataChat] = useState<MessageBoxInfo[]>([]);
  const [fileList, setFileList] = useState<Record<string, FileContent[]>>({});
  const [messagesByBox, setMessagesByBox] = useState<
    Record<string, ResponseMessageDTO[]>
  >({});
  const [readStatusByBox, setReadStatusByBox] = useState<
    Record<string, boolean>
  >({});
  const [isTyping, setIsTyping] = useState<boolean>(false);

  return (
    <ChatContext.Provider
      value={{
        dataChat,
        setDataChat,
        fileList,
        setFileList,
        messagesByBox,
        setMessagesByBox,
        readStatusByBox,
        setReadStatusByBox,
        isTyping,
        setIsTyping
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
