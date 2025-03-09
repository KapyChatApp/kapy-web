"use client";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Textarea } from "@/components/ui/textarea";
interface CommentInputProps {
  onCommentChange: (value: string) => void;
  commentContent: string;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
  handleAction?: () => Promise<void>;
}
const CommentInput = ({
  onCommentChange,
  setTyping,
  commentContent,
  handleAction
}: CommentInputProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: { emoji: string }) => {
    const newComment = commentContent + emojiData.emoji;
    onCommentChange(newComment); // Cập nhật giá trị khi thêm emoji
    setTyping(newComment.length > 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onCommentChange(newValue);
    setTyping(newValue.length > 0);
  };
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "36px"; // Đặt lại chiều cao ban đầu
    const newHeight = e.target.scrollHeight;
    e.target.style.height = `${Math.min(newHeight, 160)}px`; // Giới hạn chiều cao tối đa
  };
  // Hàm xử lý khi người dùng dừng nhập sau một khoảng thời gian nhất định (ví dụ 2 giây)
  const handleBlur = () => {
    setTyping(false); // Khi người dùng rời khỏi textarea, reset trạng thái
  };
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống hàng
      if (handleAction) {
        await handleAction(); // Gọi hàm nếu tồn tại
      }
    }
  };
  return (
    <div className="flex justify-start w-full">
      <div className="relative w-full">
        <Textarea
          className={`text-dark100_light900 bg-transparent min-h-[20px] h-[20px] border-none text-[14px] p-[2px] overflow-scroll scrollable placeholder:text-dark600_light500 shadow-none ${
            commentContent.trim().length > 0 ? "w-[400px]" : "w-[440px]"
          }`}
          value={commentContent}
          onChange={handleChange}
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment..."
        />
        {commentContent.trim().length > 0 && (
          <button
            className="absolute right-4 top-[50%] transform -translate-y-1/2 mr-6 mt-[-2px]"
            // onClick={() => {
            //   handleKeyDown;
            // }}
          >
            <span className="text-accent-blue body-bold">Post</span>
          </button>
        )}
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
          }}
        >
          <Icon
            icon="heroicons-solid:emoji-happy"
            width={16}
            height={16}
            className="text-primary-500 cursor-pointer w-[16px] h-[16px]"
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

export default CommentInput;
