"use client";
import { PostResponseDTO } from "@/lib/DTO/post";
import { formatTimeMessageBox } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import OtherPost from "../Other/OtherPost";

const Information = ({ post }: { post: PostResponseDTO }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted ? (
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
          <OtherPost post={post} />
        </div>
      </div>
    </div>
  ) : null;
};

export default Information;
