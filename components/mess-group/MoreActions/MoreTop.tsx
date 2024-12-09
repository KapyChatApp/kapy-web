"use client";
import { actionsButton } from "@/constants/moreActions";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { MoreTopProps } from "@/types/mess-group";

interface Top {
  top: MoreTopProps;
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
  setClickOtherRight?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
}

const MoreTop: React.FC<Top> = ({
  top,
  setActiveComponent,
  setOpenMore,
  setClickOtherRight
}) => {
  const pathname = usePathname();
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);
  const { ava, name } = top;

  //RESPONSIVE
  const handleBack = () => {
    setOpenMore(false);
    if (setClickOtherRight) {
      setClickOtherRight(false);

      console.log("Back is clicked");
    }
  };

  //Open More Responsive
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [storedOpenMore, setStoredOpenMore] = useState(false);
  useEffect(() => {
    const stored = sessionStorage.getItem("openMore");
    if (stored !== null) {
      setStoredOpenMore(JSON.parse(stored));
    }
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

  return isGroup ? (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-fit gap-[12px]">
      <div className="flex items-start md:justify-center justify-start w-full h-fit">
        <div
          className={`flex h-fit w-fit cursor-pointer  
            ${isMdScreen && storedOpenMore ? "flex" : "md:hidden"}`}
        >
          <Icon
            icon="eva:arrow-back-fill"
            width={30}
            height={30}
            className="text-primary-500"
            onClick={handleBack}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-fit gap-[12px]">
          <Image
            src={ava}
            alt="ava"
            width={80}
            height={80}
            className="rounded-full"
          />
          <p className="paragraph-regular text-dark100_light900">{name}</p>
        </div>
      </div>
      <div className="flex items-center md:justify-between justify-center gap-3 md:gap-0 w-full h-fit">
        {actionsButton
          .filter(
            (action) => action.click !== "best" && action.click !== "block"
          )
          .map((item) => (
            <ActionButton
              action={item}
              setActiveComponent={setActiveComponent}
            />
          ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-fit gap-[12px]">
      <div className="flex items-start md:justify-center justify-start w-full h-fit">
        <div
          className={`flex h-fit w-fit cursor-pointer ${
            isMdScreen && storedOpenMore ? "flex" : "md:hidden"
          }`}
        >
          <Icon
            icon="eva:arrow-back-fill"
            width={30}
            height={30}
            className="text-primary-500"
            onClick={handleBack}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-fit gap-[12px]">
          <Image
            src={ava}
            alt="ava"
            width={80}
            height={80}
            className="rounded-full"
          />
          <p className="paragraph-regular text-dark100_light900">{name}</p>
        </div>
      </div>
      <div className="flex items-center md:justify-between w-full h-fit justify-center gap-3 md:gap-0">
        {actionsButton
          .filter(
            (action) => action.click !== "add" && action.click !== "manage"
          )
          .map((item) => (
            <ActionButton
              action={item}
              setActiveComponent={setActiveComponent}
            />
          ))}
      </div>
    </div>
  );
};

export default MoreTop;
