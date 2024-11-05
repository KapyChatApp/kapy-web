"use client";
import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có token trong localStorage hay không
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
    } else {
      setHasToken(false);
      window.location.href = "/signin";
    }
  }, []);
  return (
    hasToken && (
      <main className="background-light850_dark200 flex flex-row overflow-scroll scrollable w-full cursor-default h-screen min-w-[492px]">
        <LeftSidebar />
        <section className="bg-transparent w-full flex flex-row h-full overflow-y-hidden">
          <div className="h-full w-full cursor-default ">{children}</div>
        </section>
      </main>
    )
  );
};

export default Layout;
