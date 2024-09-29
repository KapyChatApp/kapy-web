"use client";
import LeftGroup from "@/components/groups/LeftGroup";
import RightGroup from "@/components/groups/RightGroup";
import { useState } from "react";

const page = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggleChange = (newValue: boolean) => {
    setIsToggled(newValue);
    console.log("Toggle button state:", newValue);
  };

  return (
    <section className="py-[16px] pr-[16px] w-full flex h-screen">
      <div className="flex flex-row w-full">
        <div className="flex h-full w-[25.6608%]">
          <LeftGroup />
        </div>
        <div className="flex h-full w-full bg-transparent ">
          <RightGroup />
        </div>
      </div>
    </section>
  );
};

export default page;
