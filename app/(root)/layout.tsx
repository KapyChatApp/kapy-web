import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark200 flex flex-row ">
      <LeftSidebar />
      <div className="bg-transparent flex flex-row">
        <section className="">
          <div className="ms-auto h-screen">{children}</div>
        </section>
        RightSidebar
      </div>
    </main>
  );
};

export default Layout;
