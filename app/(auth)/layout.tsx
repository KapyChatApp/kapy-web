"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { checkTokenFrontend } from "@/lib/check-toke";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      if (token) {
        const result = await checkTokenFrontend(token);
        console.log(result);
        if (result && typeof result === "object" && result.isAuthenticated) {
          router.push("/chat");
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }
    };

    verifyToken();
  }, [router]);
  return (
    <main className="background-light900_dark200 flex flex-row w-full cursor-default min-h-[728px] md:pr-6 md:py-6 md:pl-14 md:justify-between sm:justify-center justify-start p-4 overflow-scroll custom-scrollbar">
      <div className="flex md:max-w-[50%] md:w-[50%] w-fit h-full pr-14 items-center justify-center pb-5">
        <div className="flex flex-col items-center justify-start gap-[72px] md:w-full w-[490px] h-fit ">
          <div className="flex flex-row gap-4 w-full justify-start items-center h-fit">
            <Image
              src="/assets/images/icon.png"
              alt="logo"
              width={42}
              height={42}
              className="rounded-full"
            />
            <p className="text-dark100_light900 text-[32px] font-bold chewy-regular">
              Kapy ChatApp
            </p>
          </div>
          {children}
        </div>
      </div>

      {/* Background */}
      <div className="hidden md:flex w-[50%] min-h-full rounded-r-xl rounded-tl-xl rounded-bl-[60px] bg-primary-500 bg-opacity-20 dark:bg-opacity-60"></div>
    </main>
  );
};

export default Layout;
