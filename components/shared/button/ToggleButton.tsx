"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface ToggleButtonProps {
  onDataChange: (data: boolean) => void; // Hàm callback để gửi dữ liệu lên cha
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onDataChange }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    const newValue = !isToggled;
    setIsToggled(newValue);
    onDataChange(newValue); // Gọi callback để truyền dữ liệu lên cha
  };

  return (
    <Button
      onClick={handleToggle} // Gọi hàm handleClick khi button được nhấn
      className="flex bg-transparent cursor-pointer py-[12px] px-[8px] shadow-none hover:shadow-none focus:shadow-none outline-none border-none"
    >
      <Icon
        icon="basil:other-1-outline"
        width={24}
        height={24}
        style={{ color: isToggled ? "#FFFFFF" : "#f57206" }}
        // Nếu isActive là true, thì background sẽ hiện, nếu không sẽ là transparent
        className={`rounded-full transition-colors duration-200 ease-in-out ${
          isToggled ? "bg-primary-500" : "bg-transparent"
        }`}
      />
    </Button>
  );
};

export default ToggleButton;
