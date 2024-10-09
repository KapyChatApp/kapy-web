"use client";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

interface inputPasswordProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({ onChange, value }: inputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="relative w-full">
      <div className="bg-transparent border boder-light-500 dark:border-dark-500 relative flex min-h-[36px] grow items-center gap-[12px] rounded-[10px] px-[16px] py-[8px]">
        <Input
          type={showPassword ? "text" : "password"}
          className="paragraph-light text-dark100_light900 no-focus bg-transparent border-none shadow-none outline-none w-full h-full p-[0px]"
          value={value}
          onChange={onChange}
        />
        <Icon
          icon={
            showPassword ? "fluent:eye-12-filled" : "mingcute:eye-close-fill"
          }
          width={18}
          height={18}
          className="text-dark100_light900 opacity-60 cursor-pointer"
          onClick={togglePasswordVisibility}
        />
      </div>
    </div>
  );
};

export default PasswordInput;
