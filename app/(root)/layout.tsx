import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark200 flex flex-row overflow-y-hidden w-full flex-grow">
      <LeftSidebar />
      <section className="bg-transparent flex flex-row flex-grow">
        <div className="ms-auto h-screen flex-grow">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
