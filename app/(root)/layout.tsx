import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark200 flex flex-row overflow-y-hidden w-full cursor-default h-screen ">
      <LeftSidebar />
      <section className="bg-transparent w-full flex flex-row h-full overflow-y-hidden">
        <div className="h-full w-full cursor-default ">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
