"use client";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
interface MessageInputProps {
  onMessageChange: (value: string) => void;
  messageContent: string;
  setMessageContent: React.Dispatch<React.SetStateAction<string>>;
  handleAction: () => Promise<void>;
}
const MessageInput = ({
  onMessageChange,
  setMessageContent,
  messageContent,
  handleAction
}: MessageInputProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: { emoji: string }) => {
    const newMessage = messageContent + emojiData.emoji;
    setMessageContent(newMessage);
    onMessageChange(newMessage); // Cập nhật giá trị khi thêm emoji
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessageContent(newValue);
    onMessageChange(newValue);
  };
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "36px"; // Đặt lại chiều cao ban đầu
    const newHeight = e.target.scrollHeight;
    e.target.style.height = `${Math.min(newHeight, 160)}px`; // Giới hạn chiều cao tối đa
  };
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống hàng
      await handleAction(); // Gửi tin nhắn
    }
  };
  return (
    <div className="flex justify-start w-full">
      <div className="relative w-full">
        <Textarea
          className="text-dark100_light900 background-light800_dark500 file:background-light800_dark500 file:text-[14px] file:text-wrap file:text-start file:text-dark100_light900 file:font-[320] placeholder:text-start placeholder:text-[14px] placeholder:text-dark100_light900 placeholder:font-[320] min-h-[36px] h-[36px] rounded-[20px] border-none md:text-[14px] text-[12px] font-[320] px-[16px] py-[9px] pr-[40px]  overflow-scroll scrollable"
          value={messageContent}
          onChange={handleChange}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Aa"
        />
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Icon
            icon="heroicons-solid:emoji-happy"
            width={28}
            height={28}
            className="text-primary-500 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
          />
        </button>
        {showEmojiPicker && (
          <div className="emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
