import React, { useEffect, useState } from "react";
import MessageContent from "./[id]/page";
const Page = () => {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center background-light900_dark400">
          <div className="loader"></div>
        </div>
      }
    >
      <MessageContent />
    </React.Suspense>
  );
};

export default Page;
