import Image from "next/image";
import React from "react";
import NoResult from "./NoResult";

const RightMessageRaw = () => {
  return (
    <div className="flex flex-row w-full h-full">
      <div
        className={`w-full h-full background-light900_dark400 rounded-tr-[12px] rounded-br-[12px] pl-[16px] rounded-tl-[12px] rounded-bl-[12px] lg:rounded-tl-[0px] lg:rounded-bl-[0px] md:rounded-tl-[0px] md:rounded-bl-[0px]`}
      >
        <div
          className={`flex-col flex-1 w-full py-[16px] lg:px-[12px] pl-0 pr-[12px] justify-between h-full`}
        >
          <NoResult
            title="No chats selected"
            description="Let's add some new friends"
            link="/friends/suggestion"
            linkTitle="Suggested Friends"
          />
        </div>
      </div>
    </div>
  );
};

export default RightMessageRaw;
