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
  likedIds: [
    {
      _id: "1",
      firstName: "rose",
      lastName: "ruby",
      avatar:
        "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png"
    },
    {
      _id: "2",
      firstName: "mei",
      lastName: "truyn",
      avatar:
        "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png"
    },
    {
      _id: "3",
      firstName: "bay",
      lastName: "max",
      avatar:
        "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png"
    }
  ],
  shares: [],
  comments: [
    {
      _id: "1",
      firstName: "Nguyễn",
      lastName: "Văn A",
      nickName: "A Nguyễn",
      avatar:
        "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png",
      userId: "1",
      likedIds: ["2", "3"],
      replieds: [
        {
          _id: "2",
          firstName: "Trần",
          lastName: "Thị B",
          nickName: "B Trần",
          avatar:
            "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png",
          userId: "2",
          likedIds: ["1"],
          replieds: [],
          caption: "Cảm ơn bạn!",
          createAt: "2024-03-08T10:00:00Z",
          createBy: "user_002"
        }
      ],
      caption: "Bài viết hay quá!",
      createAt: "2024-03-08T09:30:00Z",
      createBy: "1"
    },
    {
      _id: "3",
      firstName: "Lê",
      lastName: "Văn C",
      nickName: "C Lê",
      avatar:
        "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png",
      userId: "3",
      likedIds: ["1", "2"],
      replieds: [
        {
          _id: "4",
          firstName: "Phạm",
          lastName: "Thị D",
          nickName: "D Phạm",
          avatar:
            "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png",
          userId: "4",
          likedIds: ["3"],
          replieds: [],
          caption: "Mình đồng ý!",
          createAt: "2024-03-08T11:00:00Z",
          createBy: "4"
        }
      ],
      caption: "Thông tin hữu ích, cảm ơn!",
      createAt: "2024-03-08T10:45:00Z",
      createBy: "3"
    }
  ],
  caption: "hello",
  createAt: "2025-01-02T04:47:05.847+00:00",
  contents: [
    {
      _id: "1",
      fileName: "avatar.png",
      url: "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png",
      bytes: 102400,
      width: 500,
      height: 500,
      format: "png",
      type: "Image"
    },
    {
      _id: "2",
      fileName: "video.mp3",
      url: "https://res.cloudinary.com/dtn9r75b7/video/upload/v1735799193/Videos/cy0s5a4ljaipis4xk3io.mov",
      bytes: 102400,
      width: 500,
      height: 500,
      format: "MOV",
      type: "Video"
    },
    {
      _id: "3",
      fileName: "tests-example.xls",
      url: "https://res.cloudinary.com/dtn9r75b7/raw/upload/v1735796263/Documents/Documents/tests-example.xls",
      bytes: 102400,
      width: 500,
      height: 500,
      format: "xls",
      type: "Other"
    },
    {
      _id: "3",
      fileName: "7.mp3.m4a",
      url: "https://res.cloudinary.com/dtn9r75b7/video/upload/v1735801570/Audios/Audios/7.mp3.m4a",
      bytes: 102400,
      width: 500,
      height: 500,
      format: "m4a",
      type: "Audio"
    }
  ]
};
const Feeds = () => {
  const [isClickRecent, setIsClickRecent] = useState(true);
  const [isClickBff, setIsClickBff] = useState(false);
  const [arrayPost, setArrayPost] = useState<PostResponseDTO[]>([]);
  return (
    <div className="flex flex-col w-full h-full ">
      <div className="flex w-full h-fit items-center justify-between mb-6 pr-4">
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

      <div className="flex flex-col w-full h-full items-center justify-start overflow-scroll custom-scrollbar">
        {/* {arrayPost.map((item) => (
          <PostFrame post={item} />
        ))} */}
        <PostFrame post={detailPost} />
      </div>
    </div>
  );
};

export default Feeds;
