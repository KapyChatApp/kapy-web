"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ButtonLeftProps {
  isClick: boolean;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  number: number;
  icon: string;
  isPathname: boolean;
  route: string;
}

interface LeftProps {
  buttonLeft: ButtonLeftProps;
}

const ButtonLeft: React.FC<LeftProps> = ({ buttonLeft }) => {
  const { isClick, setClick, label, number, icon, isPathname, route } =
    buttonLeft;

  const handleButton = () => {
    setClick(!isClick);
  };

  const router = useRouter();
  const handleLink = () => {
    router.push(`/friends/${route}`);
  };
  return icon !== "" ? (
    <div
      className={`${
        isPathname
          ? "bg-light-700 dark:bg-dark-200 bg-opacity-50 dark:bg-opacity-50"
          : "bg-transparent hover:bg-light-700 dark:hover:bg-dark-200 hover:bg-opacity-30 dark:hover:bg-opacity-30"
      } shadow-none border-none flex flex-row items-center justify-between w-full p-3 rounded-lg`}
      onClick={handleButton}
    >
      <p className="text-dark100_light900 paragraph-regular ">{label}</p>
      <Icon
        icon={isClick ? "ri:arrow-drop-up-line" : "ri:arrow-drop-down-line"}
        width={24}
        height={24}
        className="text-dark100_light900"
      />
    </div>
  ) : (
    <Link
      href={`/friends/${route}`}
      className="w-full justify-start items-center flex"
    >
      <div
        className={`${
          isPathname
            ? "bg-light-700 dark:bg-dark-200 bg-opacity-50 dark:bg-opacity-50"
            : "bg-transparent hover:bg-light-700 dark:hover:bg-dark-200 hover:bg-opacity-30 dark:hover:bg-opacity-30"
        } flex flex-row w-full items-center justify-start gap-3 p-3 rounded-lg shadow-none border-none`}
        onClick={handleLink}
      >
        <p className="text-dark100_light900 paragraph-regular">{label}</p>
        {number > 0 && (
          <p className="text-dark100_light900 body-light">{number}</p>
        )}
      </div>
    </Link>
  );
};

export default ButtonLeft;
