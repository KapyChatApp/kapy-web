"use client";
import { OtherBoxButtonProps } from "@/components/friends/FriendBox";
import OtherBoxButton from "@/components/friends/OtherBoxButton";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { PostResponseDTO } from "@/lib/DTO/post";
import { formatDate, formatTimeMessageBox } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useState } from "react";

const otherBox: OtherBoxButtonProps[] = [
  {
    icon: "material-symbols:report-rounded",
    label: "Report",
    value: "report"
  }
];

const Information = ({ post }: { post: PostResponseDTO }) => {
  const [isPop, setPop] = useState(false);
  return (
    <div className="flex w-full h-fit pb-3 pl-1 items-center justify-between">
      <div className="flex w-fit h-fit items-center justify-center">
        <div className="w-[42px] h-[42px] mr-3">
          <Image
            alt="ava"
            src={post.avatar}
            width={42}
            height={42}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex items-center justify-center w-fit h-fit">
          <span className="body-semibold text-dark100_light900">
            {post.firstName + " " + post.lastName}
          </span>
          <div className="w-fit h-fit">
            <Icon
              icon="ph:dot"
              width={16}
              height={16}
              className="text-dark600_light500"
            />
          </div>
          <span className="body-regular text-dark600_light500">
            {formatTimeMessageBox(post.createAt)}
          </span>
        </div>
      </div>
      <div className="w-fit h-fit">
        <div className="ml-2">
          <Popover onOpenChange={(open) => setPop(open)}>
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
              {otherBox.map((item) => (
                <div className="flex w-full h-fit">
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
  );
};

export default Information;
