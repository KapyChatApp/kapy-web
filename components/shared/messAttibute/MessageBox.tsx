import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  id: string;
  username: string;
  userId: string;
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
  userId,
  sender,
  ava,
  content,
  pin,
  time,
  isOnline,
  isSeen
}: Props) => {
  const pathname = usePathname();
  const isActive = pathname.includes(id) || pathname === `/${id}`;
  return (
    <Link
      key=""
      href={`/${userId}`}
      className={`${
        isActive
          ? "text-dark100_light900 bg-light-800 dark:bg-dark-200 dark:bg-opacity-40"
          : "text-dark100_light900 bg-transparent"
      } hover:bg-light-800 hover:dark:bg-dark-200 hover:dark:bg-opacity-40 rounded-[20px] hover:rounded-[20px] h-[80px] flex items-center justify-start bg-transparent relative group`}
    >
      <div className="bg-transparent flex items-center justify-start w-full relative">
        <div className="flex flex-row bg-transparent py-[16px] px-[8px] w-full justify-between items-center relative">
          <div className="flex flex-row bg-transparent gap-[12px] min-w-0 items-center pr-1">
            <div className="relative flex-shrink-0 w-fit">
              <Image
                src={`${ava}`}
                alt="ava"
                width={48}
                height={48}
                className="rounded-full"
              />
              {isOnline && (
                <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
              )}
            </div>

            <div className="flex flex-col bg-transparent items-start justify-start gap-[8px] flex-grow overflow-hidden min-w-0">
              <p className="paragraph-regular text-dark100_light900">{`${username}`}</p>
              <div className="flex items-center w-full min-w-0">
                {isSeen ? (
                  <p className="small-custom-2 justify-start text-dark100_light900">
                    {`${sender}`}:
                  </p>
                ) : (
                  <p className="small-bold-custom-2 text-dark100_light900">
                    {`${sender}`}:
                  </p>
                )}
                <div className="flex min-w-0 ">
                  {isSeen ? (
                    <p className="small-custom ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900">{`${content}`}</p>
                  ) : (
                    <p className="small-bold-custom justify-start ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900">{`${content}`}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-transparent items-center justify-end gap-[7px] relative">
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
