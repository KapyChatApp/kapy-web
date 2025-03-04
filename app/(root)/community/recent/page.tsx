"use client";
import Feeds from "@/components/community/Feeds";
import Suggestion from "@/components/community/Suggestion";
import { PostResponseDTO } from "@/lib/DTO/post";
import React, { useState } from "react";

const Community = () => {
  return (
    <div className="h-full w-full py-4 pr-4 flex gap-4">
      <div className="flex w-3/4 h-full background-light900_dark400 rounded-xl p-4">
        <Feeds />
      </div>

      <div className="h-full p-4">
        <Suggestion />
      </div>
    </div>
  );
};

export default Community;
