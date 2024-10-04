import React from "react";
import GlobalSearch from "../shared/search/globalSearch";
import { box } from "@/constants/messenger";
import MessageBox from "../mess-group/MessageBox";
import useSearchMessageBox from "@/hooks/use-search-message-box";

const LeftMessage = () => {
  const { searchTerm, setSearchTerm, filteredBox } = useSearchMessageBox(box);
  return (
    <div className="flex flex-col background-light900_dark400 w-full h-full py-[16px] px-[8px] rounded-tl-[12px] rounded-bl-[12px]">
      <p className="h2-medium text-dark100_light900 px-2">Message</p>

      <GlobalSearch onChange={(e) => setSearchTerm(e.target.value)} />

      <div className="mt-[12px] flex w-full flex-col scrollable overflow-scroll">
        {filteredBox.length > 0
          ? filteredBox.map((item) => <MessageBox box={item} />)
          : null}
      </div>
    </div>
  );
};

export default LeftMessage;
