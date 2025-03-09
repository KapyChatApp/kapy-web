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
import AccountLink from "./AccountLink";

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
        <AccountLink
          userId={userId}
          accountName={accountName}
          avatar={avatar}
        />
      </header>

      <div className="w-10 h-10 mr-2">
        <div className="flex p-2">
          <Popover key="popover-detail" onOpenChange={(open) => setPop(open)}>
            <PopoverTrigger>
              <span>
                <Icon
                  icon="basil:other-1-outline"
                  width={24}
                  height={24}
                  className="text-dark100_light900"
                />
              </span>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col background-light900_dark200 h-fit rounded-lg justify-center items-center dark:border-dark-300 w-[100px] p-1">
              {otherBoxPost.map((item, index) => (
                <div key={index} className="flex w-full h-fit">
                  <Button
                    className="flex flex-row p-0 gap-1 shadow-none border-none hover:background-light700_dark400 rounded-lg w-full"
                    //onClick={handleButton}
                  >
                    <Icon
                      icon={item.icon}
                      width={20}
                      height={20}
                      className="text-accent-red"
                    />
                    <p className="text-accent-red body-regular">{item.label}</p>
                  </Button>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  ) : null;
};

export default Header;
