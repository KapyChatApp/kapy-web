"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

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

  return icon !== "" ? (
    <Button
      className={`${
        isPathname
          ? "bg-light-700 dark:bg-dark-200 bg-opacity-50 dark:bg-opacity-50"
          : "bg-transparent"
      } shadow-none border-none flex flex-row hover:bg-light-700 dark:hover:bg-dark-200 hover:bg-opacity-50 dark:hover:bg-opacity-50 items-center justify-between w-full p-3 rounded-lg`}
      onClick={handleButton}
    >
      <p className="text-dark100_light900 paragraph-regular ">{label}</p>
      <Icon
        icon={isClick ? "ri:arrow-drop-up-line" : "ri:arrow-drop-down-line"}
        width={24}
        height={24}
        className="text-dark100_light900"
      />
    </Button>
  ) : (
    <Link
      href={`/friends/${route}`}
      className="w-full justify-start items-center flex"
    >
      <Button
        className={`${
          isPathname
            ? "bg-light-700 dark:bg-dark-200 bg-opacity-50 dark:bg-opacity-50"
            : "bg-transparent"
        } flex flex-row w-full items-center justify-start gap-3 hover:bg-light-700 dark:hover:bg-dark-200 hover:bg-opacity-50 dark:hover:bg-opacity-50 p-3 rounded-lg shadow-none border-none`}
      >
        <p className="text-dark100_light900 paragraph-regular">{label}</p>
        {number > 0 && (
          <p className="text-dark100_light900 body-light">{number}</p>
        )}
      </Button>
    </Link>
  );
};

export default ButtonLeft;
