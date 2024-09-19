import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  id: string;
  username: string;
  sender: string;
  ava: string;
  content?: string;
  pin: boolean;
  time: string;
  isOnline: boolean;
  isSeen: boolean;
}

const MessageBox = ({
  id,
  username,
  sender,
  ava,
  content,
  pin,
  time,
  isOnline,
  isSeen
}: Props) => {
  return (
    <Link
      key=""
      href={`/${id}`}
      className="text-dark100_light900 hover:background-light800_dark200 hover:dark:opacity-40 hover:rounded-[20px] h-[80px] flex items-center justify-start bg-transparent relative group"
    >
      <div className="bg-transparent flex items-center justify-start w-full relative">
        <div className="flex flex-row bg-transparent py-[16px] px-[8px] min-w-0 justify-start items-center flex-grow relative">
          <div className="flex flex-row bg-transparent gap-[12px] flex-grow min-w-0">
            <div className="flex items-center bg-transparent relative flex-shrink-0 ">
              <Image
                src={`${ava}`}
                alt="ava"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
            </div>

            <div className="flex flex-col bg-transparent items-start justify-start gap-[8px] flex-grow overflow-hidden min-w-0">
              <p className="paragraph-regular">{`${username}`}</p>
              <div className="flex items-center justify-start w-full min-w-0">
                <p className="small-custom-2 justify-start">{`${sender}`}:</p>
                <p className="small-custom justify-start">{`${content}`}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-transparent items-center justify-end gap-[7px] flex-shrink-0 relative">
            <p className="small-custom">{`${time}`}</p>
            {pin ? (
              <div className="w-full justify-end items-end flex">
                <Icon
                  icon="tabler:pin-filled"
                  width={18}
                  height={18}
                  className="background-light900_dark100 "
                />
              </div>
            ) : (
              <div className="w-full justify-end items-end hidden group-hover:flex">
                <Icon
                  icon="tabler:pin"
                  width={18}
                  height={18}
                  className="background-light900_dark100"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MessageBox;
