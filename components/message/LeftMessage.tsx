import React from "react";
import GlobalSearch from "../search/globalSearch";
import MessageBox from "../shared/messAttibute/MessageBox";
import { box } from "@/constants";
import { usePathname } from "next/navigation";

const LeftMessage = () => {
  return (
    <div className="flex flex-col w-full h-screen py-[16px] px-[8px]">
      <div className="text-dark100_light900">
        <p className="h2-medium">Message</p>
      </div>

      <GlobalSearch />

      <div className="mt-[12px] flex w-full flex-col overflow-y-auto scrollable overflow-scroll overflow-x-hidden">
        {box.length > 0
          ? box.map((item) => (
              <MessageBox
                key={item.id}
                id={item.userId}
                username={item.username}
                userId={item.userId}
                sender={item.sender}
                ava={item.ava}
                content={item.content}
                pin={item.pin}
                time={item.time}
                isOnline={item.isOnline}
                isSeen={item.isSeen}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default LeftMessage;
