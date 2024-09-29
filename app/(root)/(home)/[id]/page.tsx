"use client";
import LeftMessage from "@/components/message/LeftMessage";
import RightMessage from "@/components/message/RightMessage";
const page = () => {
  return (
    <section className="py-[16px] pr-[16px] w-full flex h-screen">
      <div className="flex flex-row w-full">
        <div className="flex h-full w-[25.6608%]">
          <LeftMessage />
        </div>
        <div className="flex h-full w-full bg-transparent ">
          <RightMessage />
        </div>
      </div>
    </section>
  );
};

export default page;
