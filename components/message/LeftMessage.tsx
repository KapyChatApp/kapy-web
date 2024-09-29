import React from "react";
import GlobalSearch from "../shared/search/globalSearch";
import { box } from "@/constants/messenger";
import { usePathname } from "next/navigation";
import MessageBox from "../mess-group/MessageBox";

const LeftMessage = () => {
  return (
    <div className="flex flex-col background-light900_dark400 w-full h-full py-[16px] px-[8px] rounded-tl-[12px] rounded-bl-[12px]">
      <p className="h2-medium text-dark100_light900">Message</p>

      <GlobalSearch />

      <div className="mt-[12px] flex w-full flex-col overflow-y-auto scrollable overflow-scroll overflow-x-hidden">
        {box.length > 0 ? box.map((item) => <MessageBox box={item} />) : null}
      </div>
    </div>
  );
};

export default LeftMessage;
