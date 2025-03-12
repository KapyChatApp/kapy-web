"use client";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { otherBoxPost } from "@/constants/post";
import { Button } from "@/components/ui/button";
import ReportPost from "../../ReportPost";

const Header = ({
  avatar,
  userId,
  accountName
}: {
  avatar: string;
  userId: string;
  accountName: string;
}) => {
  const [isPop, setPop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted ? (
    <div className="flex w-full h-fit items-center justify-start border-b-[0.6px] border-light500_dark400">
      <header className="flex flex-grow w-full h-full pl-4 py-[14px] pr-1 items-center justify-center">
        <div className="flex w-full h-fit">
          <div className="w-8 h-8">
            <a className="w-8 h-8" href={`/account/${userId}`}>
              <Image
                alt="ava"
                src={avatar}
                width={32}
                height={32}
                className="object-cover rounded-full"
              />
            </a>
          </div>
          <div className="flex-grow w-full h-full items-start justify-center ml-[14px]">
            <div className="w-full h-full flex p-[2px]">
              <span className="w-full text-dark100_light900 body-semibold">
                <a
                  className="w-fit transition-opacity duration-300 hover:opacity-40"
                  href={`/account/${userId}`}
                >
                  {accountName}
                </a>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="w-10 h-10 mr-2">
        <div className="flex p-2">
          <ReportPost />
        </div>
      </div>
    </div>
  ) : null;
};

export default Header;
