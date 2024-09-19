import LeftMessage from "@/components/message/LeftMessage";
import RightMessage from "@/components/message/RightMessage";
import React from "react";

const message = () => {
  return (
    <section className="py-[16px] flex h-screen lg:w-[836px]">
      <div className=" flex flex-1 flex-row  background-light900_dark400 rounded-[12px]">
        <LeftMessage />
        <RightMessage />
      </div>
    </section>
  );
};

export default message;
