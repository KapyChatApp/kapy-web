import LeftComponent from "@/components/friends/LeftComponent";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full cursor-default py-4 pr-4">
      <div className="flex flex-row gap-[14px] background-light900_dark400 w-full h-full rounded-[12px] overflow-scroll scrollable">
        <div className="md:flex hidden xl:w-[26%] lg:w-[30%] w-[36%] h-full overflow-hidden">
          <LeftComponent />
        </div>

        <div className="flex md:w-[75%] w-full h-full overflow-scroll scrollable">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
