"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import PostFrame from "./Posts/PostFrame";
import { PostResponseDTO } from "@/lib/DTO/post";
const detailPost: PostResponseDTO = {
  _id: "",
  firstName: "Junie",
  lastName: "Vu",
  nickName: "",
  avatar:
    "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png",
  userId: "",
  likedIds: ["1", "2", "3"],
  shares: [],
  comments: [],
  caption: "hello",
  createAt: "2025-01-02T04:47:05.847+00:00",
  contents: []
};
const Feeds = () => {
  const [isClickRecent, setIsClickRecent] = useState(true);
  const [isClickBff, setIsClickBff] = useState(false);
  const [arrayPost, setArrayPost] = useState<PostResponseDTO[]>([]);
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full h-fit items-center justify-between mb-6">
        <span className="text-xl lg:text-2xl font-medium lg:font-bold text-dark100_light900">
          Feeds
        </span>
        <div className="flex w-fit h-fit gap-2 items-center justify-center">
          <Button
            className="bg-transparent p-2 border-none shadow-none"
            onClick={() => {
              setIsClickBff(false);
              setIsClickRecent(true);
            }}
          >
            <span
              className={`${
                isClickRecent
                  ? "body-semibold text-dark100_light900"
                  : "text-light600_dark600 body-regular"
              }`}
            >
              Recent
            </span>
          </Button>
          <Button
            className="bg-transparent p-2 border-none shadow-none"
            onClick={() => setIsClickRecent(false)}
          >
            <span
              className={`${
                !isClickRecent
                  ? "body-semibold text-dark100_light900"
                  : "body-regular text-light600_dark600"
              }`}
            >
              Best friend
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col w-full h-full items-center justify-start overflow-auto">
        {/* {arrayPost.map((item) => (
          <PostFrame post={item} />
        ))} */}
        <PostFrame post={detailPost} />
      </div>
    </div>
  );
};

export default Feeds;
