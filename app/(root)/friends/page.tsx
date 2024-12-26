import React from "react";
import MyFriendPage from "./all-friend/page";

export default function Page() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center background-light900_dark400">
          <div className="loader"></div>
        </div>
      }
    >
      <MyFriendPage />
    </React.Suspense>
  );
}
