import { useState } from "react";
import { Icon } from "@iconify/react";
import EmojiPicker from "emoji-picker-react";
import { Textarea } from "@/components/ui/textarea";
import { CommentInputProps } from "./CommentInput";

const InputDetail = ({
  onCommentChange,
  setTyping,
  commentContent,
  files,
  setFiles,
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
    <div className="flex items-center w-full h-fit border-none">
      {/* Biểu tượng emoji */}
      <button
        className="flex py-2 px-4"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        <Icon
          icon="proicons:emoji"
          width={24}
          height={24}
          className="text-dark100_light900 cursor-pointer"
        />
      </button>

      {/* Input comment */}
      <div className="relative w-full">
        <Textarea
          className="text-dark100_light900 bg-transparent h-[40px] min-h-[40px] border-none text-[14px] py-2 px-0 overflow-scroll custom-scrollbar placeholder:text-dark600_light500 shadow-none resize-y w-[92%]"
          value={commentContent}
          onChange={handleChange}
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment..."
        />

        {/* Nút Post */}
        {commentContent.trim().length > 0 && (
          <button
            className="absolute right-0 top-[50%] transform -translate-y-1/2 mt-[-2px]"
            // onClick={() => {
            //   handleKeyDown;
            // }}
          >
            <span className="text-accent-blue body-bold">Post</span>
          </button>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-[80px] left-[680px] z-[9999]">
          <EmojiPicker
            onEmojiClick={(emoji) =>
              onCommentChange(commentContent + emoji.emoji)
            }
          />
        </div>
      )}
    </div>
  );
};

export default InputDetail;
