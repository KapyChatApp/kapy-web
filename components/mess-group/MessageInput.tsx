"use client";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "../ui/input";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  return (
    <div className="flex justify-start w-full">
      <div className="relative w-full">
        <Input
          className="text-dark100_light900 background-light800_dark500 file:background-light800_dark500 file:text-[14px] file:text-wrap file:text-start file:text-dark100_light900 file:font-[320] placeholder:text-start placeholder:text-[14px] placeholder:text-dark100_light900 placeholder:font-[320] h-[36px] rounded-[20px] border-none md:text-[14px] text-[12px] font-[320] px-[16px] py-[9px] "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
