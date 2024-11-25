"use client";
import { MessageBoxContent } from "@/lib/dataBox";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import { DetailBox } from "@/lib/dataOneBox";
import { createContext, useContext, useState } from "react";

// Tạo kiểu cho context
interface ChatContextType {
  dataChat: MessageBoxContent[];
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxContent[]>>;
  messages: ResponseMessageDTO[];
  setMessages: React.Dispatch<React.SetStateAction<ResponseMessageDTO[]>>;
  messagesByBox: Record<string, ResponseMessageDTO[]>;
  setMessagesByBox: React.Dispatch<
    React.SetStateAction<Record<string, ResponseMessageDTO[]>>
  >;
  detailByBox: Record<string, any>;
  setDetailByBox: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

// Tạo context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [dataChat, setDataChat] = useState<MessageBoxContent[]>([]);
  const [messages, setMessages] = useState<ResponseMessageDTO[]>([]);
  const [messagesByBox, setMessagesByBox] = useState<
    Record<string, ResponseMessageDTO[]>
  >({});
  const [detailByBox, setDetailByBox] = useState<Record<string, any>>({});

  return (
    <ChatContext.Provider
      value={{
        dataChat,
        setDataChat,
        messages,
        setMessages,
        messagesByBox,
        setMessagesByBox,
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
