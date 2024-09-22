"use client";
import LeftMessage from "@/components/groups/LeftMessage";
import RightMessage from "@/components/groups/RightMessage";
import RightSidebar from "@/components/shared/sidebar/RightSidebar";
import { useState } from "react";

const page = () => {
  const [isToggled, setIsToggled] = useState(false);

  // Callback để cập nhật state khi ToggleButton được nhấn
  const handleToggleChange = (newValue: boolean) => {
    setIsToggled(newValue);
    console.log("Toggle button state:", newValue);
  };

  return (
    <section className="py-[16px] pr-[16px] flex h-screen w-full gap-[16px]">
      <div
        className={`flex flex-row  background-light900_dark400 gap-[16px] rounded-[12px] ${
          isToggled ? "w-[76%]" : "w-full"
        }`}
      >
        <div className="flex h-full w-[25.6608%]">
          <LeftMessage />
        </div>
        <div className="flex h-full flex-grow bg-transparent">
          <RightMessage onToggleChange={handleToggleChange} />
        </div>
      </div>
      {isToggled && (
        <div className="flex background-light850_dark200 flex-grow overflow-auto">
          <RightSidebar />
        </div>
      )}
    </section>
  );
};

export default page;