"use client";
import { HistoryFindFriend } from "@/types/friends";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import AccountModal from "./AccountModal";

interface FindFriendBoxProps {
  user: HistoryFindFriend;
}

const FindFriendItems = ({ user }: FindFriendBoxProps) => {
  const [isAccount, setAccount] = useState(false);
  const [isDelete, setDelete] = useState(false);

  const handleAccount = () => {
    setAccount(!isAccount);
  };
  const handleDelete = () => {
    setDelete(!isDelete);
  };
  const account = {
    user: user,
    setAccount: setAccount
  };

  return (
    !isDelete && (
      <>
        <Button
          className="flex flex-row items-center justify-between w-full h-fit py-2 px-4 hover:bg-light-700 dark:hover:bg-dark-400 dark:hover:bg-opacity-80 border-none shadow-none"
          onClick={handleAccount}
        >
          <div className="flex flex-row gap-2 justify-start items-center">
            <Image
              src={user.ava}
              alt="ava"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex flex-col h-fit w-fit gap-1 items-start justify-center">
              <p className="text-dark100_light900 paragraph-15-regular">
                {user.name}
              </p>
              {user.mutualFriend > 0 && (
                <p className="text-dark100_light900 subtle-light">
                  {user.mutualFriend} mutual friends
                </p>
              )}
            </div>
          </div>

          <Button
            className="flex w-fit h-full bg-transparent hover:bg-transparent border-none shadow-none p-0"
            onClick={handleDelete}
          >
            <Icon
              icon="iconoir:cancel"
              width={18}
              height={18}
              className="text-dark100_light900"
            />
          </Button>
        </Button>

        {isAccount && <AccountModal account={account} />}
      </>
    )
  );
};

export default FindFriendItems;
