// app/message/layout.tsx
import LeftMessage from "@/components/mess-group/LeftMessage/LeftMessage";
import React from "react";

const MessageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="py-[16px] pr-[16px] w-full flex h-full overflow-hidden">
      <div className={`flex flex-row w-[25%]`}>
        <LeftMessage />
      </div>
      <div className="flex h-full w-[75%] bg-transparent flex-grow-0">
        {children}
      </div>
    </section>
  );
};

export default MessageLayout;
