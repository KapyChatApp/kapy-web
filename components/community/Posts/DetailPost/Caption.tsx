import { formatTimeMessageBox } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const CaptionCard = ({
  userId,
  avatar,
  accountName,
  caption,
  createAt
}: {
  userId: string;
  avatar: string;
  accountName: string;
  caption: string;
  createAt: string;
}) => {
  return (
    <div className="flex w-full h-fit items-center justify-start">
      <li className="flex pt-[5px] mt-[-5px] mr-[-2px] pb-4 pr-4 w-full h-fit items-center justify-start">
        <div className="flex items-start justify-center">
          <div className="flex items-center justify-center mr-[14px]">
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
          </div>
          <div className="flex-grow w-full h-auto items-center justify-center flex-col">
            <div className="flex-grow w-full h-fit items-center justify-center flex">
              <div className="w-fit h-full flex p-[2px]">
                <span className="w-full text-dark100_light900 body-semibold">
                  <a
                    className="w-fit transition-opacity duration-300 hover:opacity-40"
                    href={`/account/${userId}`}
                  >
                    {accountName}
                  </a>
                </span>
              </div>

              <div className="flex-grow h-fit w-auto flex items-center justify-start ml-1">
                <h2 className="text-dark100_light900 body-regular items-center justify-start">
                  {caption}
                </h2>
              </div>
            </div>
            <div className="flex items-center justify-start mt-2 mb-1 w-fit h-fit">
              <span className="w-auto h-auto flex items-center justify-center">
                <div className="text-dark600_light600 mr-3 small-regular">
                  {formatTimeMessageBox(createAt)}
                </div>
              </span>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};

export default CaptionCard;
