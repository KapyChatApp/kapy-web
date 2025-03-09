import Image from "next/image";
import React from "react";

const AccountLink = ({
  avatar,
  userId,
  accountName
}: {
  avatar: string;
  userId: string;
  accountName: string;
}) => {
  return (
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
  );
};

export default AccountLink;
