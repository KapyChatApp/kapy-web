"use client";
import Feeds from "@/components/community/Feeds";
import Suggestion from "@/components/community/Suggestion";
import React, { useEffect, useState } from "react";

const Community = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted ? (
    <div className="h-full w-full py-4 pr-4 flex gap-4">
      <div className="flex w-3/4 h-full background-light900_dark400 rounded-xl py-4 pl-4 ">
        <Feeds />
      </div>

      <div className="h-full p-4 flex-grow">
        <Suggestion />
      </div>
    </div>
  ) : null;
};

export default Community;
