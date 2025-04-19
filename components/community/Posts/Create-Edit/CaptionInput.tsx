import { useState } from "react";
import { Icon } from "@iconify/react";
import EmojiPicker from "emoji-picker-react";
import { Textarea } from "@/components/ui/textarea";

interface CaptionInputProps {
  onCaptionChange: (value: string) => void;
  captionContent: string;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
  handleAction?: () => Promise<void>;
}

const CaptionInput = ({
  onCaptionChange,
  setTyping,
  captionContent,
  handleAction
}: CaptionInputProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: { emoji: string }) => {
    const newCaption = captionContent + emojiData.emoji;
    onCaptionChange(newCaption);
    setTyping(newCaption.length > 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onCaptionChange(newValue);
    setTyping(newValue.length > 0);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "36px";
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

  return (
    <div className="w-full border-none">
      {/* Input caption */}
      <div className="relative w-full bg-transparent">
        <Textarea
          className="text-dark100_light900 bg-transparent h-[160px] min-h-[160px] border-none text-[14px] p-0 overflow-y-auto placeholder:text-dark600_light500 shadow-none resize-y w-full focus:outline-none"
          value={captionContent}
          onChange={handleChange}
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={captionContent ? captionContent : "Add a caption..."}
        />
      </div>

      {/* Emoji và giới hạn ký tự */}
      <div className="flex items-center justify-between mt-1">
        <button
          className="flex items-center"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Icon
            icon="proicons:emoji"
            width={24}
            height={24}
            className="text-dark100_light900 cursor-pointer"
          />
        </button>

        <span className="text-sm text-dark600_light500">
          {captionContent.length}/2,200
        </span>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-[260px] left-[370px] z-[9999]">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default CaptionInput;
