"use client";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Textarea } from "@/components/ui/textarea";
import { FileResponseDTO } from "@/lib/DTO/map";
export interface CommentInputProps {
  onCommentChange: (value: string) => void;
  commentContent: string;
  files: File | null;
  setFiles: React.Dispatch<React.SetStateAction<File | null>>;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
  handleAction: () => Promise<void>;
}
const CommentInput = ({
  onCommentChange,
  setFiles,
  files,
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
    e.target.style.height = "20px"; // Đặt lại chiều cao ban đầu
    const newHeight = e.target.scrollHeight;
    e.target.style.height = `${Math.min(newHeight, 160)}px`; // Giới hạn chiều cao tối đa
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; // Lấy duy nhất một file
    if (!selectedFile) return;

    // const newFile: FileResponseDTO = {
    //   _id: crypto.randomUUID(),
    //   fileName: selectedFile.name,
    //   url: URL.createObjectURL(selectedFile),
    //   bytes: selectedFile.size,
    //   width: 0,
    //   height: 0,
    //   format: selectedFile.name.split(".").pop() || "",
    //   type: selectedFile.type.startsWith("image") ? "Image" : "Video"
    // };

    setFiles(selectedFile); // Chỉ lưu 1 file thay vì mảng
  };

  const removeFile = () => {
    setFiles(null);
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
      <div className="relative w-full flex items-center justify-between">
        {/* Textarea */}
        <div className="flex w-full h-fit flex-col items-start justify-center">
          <Textarea
            className={`text-dark100_light900 bg-transparent min-h-[20px] h-[20px] border-none text-[14px] p-[2px] overflow-scroll scrollable placeholder:text-dark600_light500 shadow-none resize-y ${
              commentContent.trim().length > 0 ? "w-[360px]" : "w-[400px]"
            }`}
            value={commentContent}
            onChange={handleChange}
            onInput={handleInput}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
          />
          {files && (
            <div
              className={`mt-2 grid grid-cols-1 gap-2 overflow-x-auto max-w-[360px]`}
              style={{ maxHeight: "250px" }} // Giới hạn chiều cao, tạo thanh cuộn dọc
            >
              <div key={files.name} className="w-20 h-20 relative group">
                {files && files.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(files)}
                    alt="preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(files)}
                    className="w-full h-full object-cover rounded-lg"
                    controls
                  />
                )}

                {/* Nút Xóa */}
                <button
                  onClick={() => removeFile()}
                  className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-full"
                >
                  <Icon
                    icon="iconoir:cancel"
                    width={14}
                    height={14}
                    className="text-light-500"
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="flex w-fit h-full justify-center">
          {(commentContent.trim().length > 0 || files) && (
            <button
              className="ml-1 w-fit h-fit p-1"
              onClick={async () => {
                await handleAction();
              }}
            >
              <span className="text-accent-blue body-bold">Post</span>
            </button>
          )}
          <button
            className="w-fit h-fit p-1"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
            }}
          >
            <Icon
              icon="heroicons-solid:emoji-happy"
              width={20}
              height={20}
              className="text-primary-500 cursor-pointer"
            />
          </button>
          <label htmlFor="file-upload" className="w-fit h-fit p-1 ml-2">
            <Icon
              icon="solar:camera-linear"
              width={20}
              height={20}
              className="text-primary-500 cursor-pointer"
            />
          </label>
        </div>
        {showEmojiPicker && (
          <div className="emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default CommentInput;
