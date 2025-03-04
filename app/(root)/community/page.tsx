import React from "react";
import Community from "./recent/page";

const Home = () => {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center background-light900_dark400">
          <div className="loader"></div>
        </div>
      }
    >
      <Community />
    </React.Suspense>
  );
};

export default Home;
