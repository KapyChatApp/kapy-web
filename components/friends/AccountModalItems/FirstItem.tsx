"use client";
import { Button } from "@/components/ui/button";
import { HistoryFindFriend } from "@/types/friends";
import { User } from "@/types/object";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useState } from "react";

interface FirstItemProps {
  user: User | HistoryFindFriend;
}

const FirstItem = ({ user }: FirstItemProps) => {
  const [status, setStatus] = useState(user.status);

  const handleAccept = () => {
    setStatus("friend");
  };

  const handleUnfr = () => {
    setStatus("nonfriend");
  };

  const handleAdd = () => {
    setStatus("cancelfriend");
  };

  const handleCancelRequest = () => {
    setStatus("nonfriend");
  };

  return (
    <div className="w-full h-fit relative px-4">
      {/* Background */}
      {user.background === "" ? (
        <div className="absolute top-0 left-0 w-full h-[129px] background-light500_dark400 z-0"></div>
      ) : (
        <div className="absolute top-0 left-0 w-full h-[129px] z-0">
          <Image
            src={user.background}
            alt="background"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}

      <div className="w-full flex items-end justify-start relative z-10 h-fit">
        {/* Avatar */}
        <div className="mt-[112px] h-fit w-fit">
          <Image
            src={user.ava}
            alt="ava"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        {/* Name and Buttons */}
        <div className="flex w-full items-center ml-3 mt-3 h-full">
          <div className="flex flex-row w-full items-center justify-between">
            <div className="flex flex-col w-fit items-start justify-start">
              <p className="text-dark100_light900 paragraph-regular">
                {user.name}
              </p>
              {user.mutualFriend > 0 && (
                <p className="text-dark100_light900 subtle-light">
                  {user.mutualFriend} mutual friends
                </p>
              )}
            </div>

            <div className="flex flex-row gap-2 w-fit">
              {status === "nonfriend" && (
                <Button
                  className="flex w-fit h-full bg-primary-500 hover:bg-primary-500 border-none shadow-none py-[6px] px-3 rounded-lg gap-1"
                  onClick={handleAdd}
                >
                  <Icon
                    icon="mingcute:add-fill"
                    width={14}
                    height={14}
                    className="text-light-900"
                  />
                  <p className="text-light-900 body-medium">Add friend</p>
                </Button>
              )}

              {status === "invite" && (
                <Button
                  className="flex w-fit h-full bg-primary-500 hover:bg-primary-500 border-none shadow-none py-[6px] px-3 rounded-lg"
                  onClick={handleAccept}
                >
                  <p className="text-light-900 body-medium">Accept</p>
                </Button>
              )}

              {(status === "friend" || status === "best") && (
                <Button
                  className="flex w-fit h-full bg-primary-500 hover:bg-primary-500 border-none shadow-none py-[6px] px-3 rounded-lg gap-1"
                  onClick={handleUnfr}
                >
                  <Icon
                    icon="mingcute:user-x-line"
                    width={14}
                    height={14}
                    className="text-light-900"
                  />
                  <p className="text-light-900 body-medium">Unfriend</p>
                </Button>
              )}

              {status === "cancelfriend" && (
                <Button
                  className="flex w-fit h-full bg-primary-500 hover:bg-primary-500 border-none shadow-none py-[6px] px-3 rounded-lg gap-1"
                  onClick={handleCancelRequest}
                >
                  <Icon
                    icon="iconoir:cancel"
                    width={14}
                    height={14}
                    className="text-light-900"
                  />
                  <p className="text-light-900 body-medium">Cancel request</p>
                </Button>
              )}

              <Button className="flex w-fit h-full background-light700_dark400 hover:background-light700_dark400 border-none shadow-none py-[6px] px-3 rounded-lg">
                <p className="text-dark100_light900 body-medium">Message</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstItem;
