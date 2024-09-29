"use client";
import { actionsButton } from "@/constants/moreActions";
import Image from "next/image";
import React from "react";
import ActionButton from "./ActionButton";
import { usePathname } from "next/navigation";
import { MoreTopProps } from "@/types/mess-group";

interface Top {
  top: MoreTopProps;
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
}

const MoreTop: React.FC<Top> = ({ top, setActiveComponent }) => {
  const pathname = usePathname();
  const isGroup = /^\/groups\/\d+$/.test(pathname);
  const { ava, name } = top;
  return isGroup ? (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-fit gap-[12px]">
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
      <div className="flex items-center justify-between w-full h-fit">
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
      <div className="flex items-center justify-between w-full h-fit">
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
