"use client";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Icon } from "@iconify/react";
import { Textarea } from "@/components/ui/textarea";

export interface CommentInputProps {
  onCommentChange: (value: string) => void;
  commentContent: string;
  files: File | null;
  setFiles: React.Dispatch<React.SetStateAction<File | null>>;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingCommentId?: React.Dispatch<React.SetStateAction<string>>;
  handleAction: () => Promise<void>;
  variant?: "default" | "detail" | "edit"; // "comment" cho trang chính, "detail" cho trang chi tiết
}

const CommentArea = ({
  onCommentChange,
  setFiles,
  files,
  setTyping,
  setEditingCommentId,
  commentContent,
  handleAction,
  variant = "default"
}: CommentInputProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: { emoji: string }) => {
    const newComment = commentContent + emojiData.emoji;
    onCommentChange(newComment);
    setTyping(newComment.length > 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onCommentChange(newValue);
    setTyping(newValue.length > 0);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = variant === "default" ? "20px" : "36px";
    const newHeight = e.target.scrollHeight;
    e.target.style.height = `${Math.min(newHeight, 160)}px`;
  };

  const handleBlur = () => {
    setTyping(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (handleAction) {
        await handleAction();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
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
    setFiles(selectedFile);
  };

  const removeFile = () => {
    setFiles(null);
  };

  const handleCancelEdit = () => {
    if (setEditingCommentId) setEditingCommentId("");
  };

  return (
    <div
      className={`flex flex-col ${
        variant === "default" ? "justify-start" : "items-center"
      } w-full`}
    >
      <div className="flex w-full">
        {/* Khu vực icon */}
        {(variant === "detail" || variant === "edit") && (
          <div className="flex w-fit h-fit">
            <button
              className="flex py-2 pl-4 pr-2"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Icon
                icon="proicons:emoji"
                width={24}
                height={24}
                className="text-dark100_light900 cursor-pointer"
              />
            </button>
            <label htmlFor="file-upload" className="w-fit h-fit py-2 pl-2 pr-4">
              <Icon
                icon="solar:camera-linear"
                width={24}
                height={24}
                className="text-dark100_light900 cursor-pointer"
              />
            </label>
          </div>
        )}

        {/* Khu vực input */}
        <div className="relative w-full flex items-center">
          <Textarea
            className={`bg-transparent border-none text-[14px] overflow-scroll scrollable resize-y shadow-none ${
              variant === "default"
                ? `${
                    commentContent.trim().length > 0 ? "w-[360px]" : "w-[400px]"
                  } min-h-[20px] h-[20px] p-[2px]`
                : "w-[92%] h-[40px] min-h-[40px] py-2 px-0"
            }`}
            value={commentContent}
            onChange={handleChange}
            onInput={handleInput}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
          />

          {/* Hiển thị nút gửi khi có nội dung */}
          {(commentContent.trim().length > 0 || files) && (
            <button
              className="ml-1 w-fit h-fit p-1"
              onClick={async () => await handleAction()}
            >
              <span className="text-accent-blue body-bold">
                {variant === "edit" ? "Edit" : "Post"}
              </span>
            </button>
          )}

          {/* Hiển thị nút Cancel edit khi có nội dung */}
          {variant === "edit" && (
            <button className="ml-1 w-fit h-fit p-1" onClick={handleCancelEdit}>
              <span className="text-accent-red body-bold">Cancel</span>
            </button>
          )}

          {/* Icon emoji & file upload */}
          {variant === "default" && (
            <>
              <button
                className="w-fit h-fit p-1"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
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
            </>
          )}
        </div>
      </div>
      {/* Picker emoji */}
      {showEmojiPicker && (
        <div className="emoji-picker-wrapper">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      {/* File Preview */}
      {files && (
        <div
          className={`mt-2 grid grid-cols-1 gap-2 overflow-x-auto max-w-[360px] ${
            variant === "default" ? "" : "w-full pl-4"
          }`}
          style={{ maxHeight: "250px" }}
        >
          <div className="w-20 h-20 relative group">
            {files.type.startsWith("image") ? (
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
            <button
              onClick={removeFile}
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

      <input
        id="file-upload"
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default CommentArea;
