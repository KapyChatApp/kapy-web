"use client";
import LeftMessage from "@/components/mess-group/LeftMessage/LeftMessage";
import RightMessage from "@/components/mess-group/RightMessage/RightMessage";
import { useEffect, useState } from "react";
const page = () => {
  const [isClickBox, setClickBox] = useState(true);
  const [isClickOtherRight, setClickOtherRight] = useState(false);
  const divClassName = "flex h-full lg:hidden md:hidden w-full ";
  //Click open more responsive
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      // Kiểm tra kích thước cửa sổ
      if (window.innerWidth >= 768 && window.innerWidth < 878) {
        setIsMdScreen(true);
      } else {
        setIsMdScreen(false);
      }
    };

    // Kiểm tra kích thước ngay khi component render lần đầu
    handleResize();

    // Lắng nghe sự kiện thay đổi kích thước cửa sổ
    window.addEventListener("resize", handleResize);

    // Hủy lắng nghe sự kiện khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <section className="py-[16px] pr-[16px] w-full flex h-screen">
      <div className={`flex flex-row w-full`}>
        {divClassName.includes("w-full") &&
          (isClickBox ? (
            <div className="flex md:hidden h-full w-full bg-transparent ">
              <RightMessage
                setClickBox={setClickBox}
                setClickOtherRight={setClickOtherRight}
                isClickOtherRight={isClickOtherRight}
                setOpenMore={setOpenMore}
                openMore={openMore}
              />
            </div>
          ) : (
            <div className={divClassName}>
              <LeftMessage
                setClickBox={setClickBox}
                setClickOtherRight={setClickOtherRight}
              />
            </div>
          ))}
        <div
          className={`md:flex hidden h-full  ${
            isMdScreen && openMore
              ? "w-[70%]"
              : "lg:w-[25.6608%] md:w-[27%] w-[30%]"
          }`}
        >
          <LeftMessage />
        </div>
        <div className="md:flex hidden h-full w-full bg-transparent ">
          <RightMessage setOpenMore={setOpenMore} openMore={openMore} />
        </div>
      </div>
    </section>
  );
};

export default page;
