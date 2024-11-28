"use client";
import { MessageBoxContent } from "@/lib/dataBox";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import { DetailBox } from "@/lib/dataOneBox";
import { createContext, useContext, useState } from "react";
export interface LatestMessage {
  senderName: string;
  content: string;
  createAt: string;
  boxId: string;
}

// Tạo kiểu cho context
interface ChatContextType {
  readStatusByBox: Record<string, boolean>;
  setReadStatusByBox: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  dataChat: MessageBoxContent[];
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxContent[]>>;
  latestMessages: Record<string, LatestMessage>;
  setLatestMessages: React.Dispatch<
    React.SetStateAction<Record<string, LatestMessage>>
  >;
  messagesByBox: Record<string, ResponseMessageDTO[]>;
  setMessagesByBox: React.Dispatch<
    React.SetStateAction<Record<string, ResponseMessageDTO[]>>
  >;
  detailByBox: Record<string, DetailBox>;
  setDetailByBox: React.Dispatch<
    React.SetStateAction<Record<string, DetailBox>>
  >;
}

// Tạo context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [dataChat, setDataChat] = useState<MessageBoxContent[]>([]);
  const [latestMessages, setLatestMessages] = useState<
    Record<string, LatestMessage>
  >({});
  const [messagesByBox, setMessagesByBox] = useState<
    Record<string, ResponseMessageDTO[]>
  >({});
  const [readStatusByBox, setReadStatusByBox] = useState<
    Record<string, boolean>
  >({});
  const [detailByBox, setDetailByBox] = useState<Record<string, DetailBox>>({});

  return (
    <ChatContext.Provider
      value={{
        dataChat,
        setDataChat,
        latestMessages,
        setLatestMessages,
        messagesByBox,
        setMessagesByBox,
        readStatusByBox,
        setReadStatusByBox,
        detailByBox,
        setDetailByBox
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
