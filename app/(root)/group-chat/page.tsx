import React from "react";
import GroupMessContent from "./[id]/page";
const Page = () => {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center background-light900-dark400">
          <div className="loader"></div>
        </div>
      }
    >
      <GroupMessContent />
    </React.Suspense>
  );
};

export default Page;
