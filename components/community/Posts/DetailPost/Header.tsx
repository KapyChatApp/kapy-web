"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PostResponseDTO } from "@/lib/DTO/post";
import OtherButton from "../../Other/OtherButton";

const Header = ({ post }: { post: PostResponseDTO }) => {
  const [isBack, setIsBack] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted ? (
    <div className="flex w-full h-fit items-center justify-start border-b-[0.6px] border-light500_dark400">
      <header className="flex flex-grow w-full h-full pl-4 py-[14px] pr-1 items-center justify-center">
        <div className="flex w-full h-fit">
          <div className="w-8 h-8">
            <a href={`/account/${post.userId}`}>
              <div className="w-8 h-8 rounded-full relative overflow-hidden">
                <Image
                  alt="ava"
                  src={post.avatar}
                  fill
                  className="object-cover"
                />
              </div>
            </a>
          </div>
          <div className="flex-grow w-full h-full items-start justify-center ml-[14px]">
            <div className="w-full h-full flex p-[2px]">
              <span className="w-full text-dark100_light900 body-semibold">
                <a
                  className="w-fit transition-opacity duration-300 hover:opacity-40"
                  href={`/account/${post.userId}`}
                >
                  {post.firstName + " " + post.lastName}
                </a>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="w-10 h-10 mr-2">
        <div className="flex p-2">
          <OtherButton post={post} />
        </div>
      </div>
    </div>
  ) : null;
};

export default Header;
