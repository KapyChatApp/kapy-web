import LeftComponent from "@/components/friends/LeftComponent";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row gap-4 background-light900_dark400  w-full h-full py-4 pr-4 rounded-[12px] overflow-scroll scrollable">
      <div className="flex w-[25%] h-full overflow-hidden">
        <LeftComponent />
      </div>

      <div className="flex w-[75%] h-full overflow-scroll scrollable">
        {children}
      </div>
    </div>
  );
};

export default layout;
