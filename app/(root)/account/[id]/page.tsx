"use client";
import AccountLayout from "@/components/account/AccountLayout";
import { useUserContext } from "@/context/UserContext";
import { FileResponseDTO } from "@/lib/DTO/map";
import { PostResponseDTO } from "@/lib/DTO/post";
import { AccountData } from "@/types/account";
import React, { useEffect, useState } from "react";

const selfAccountData: AccountData = {
  type: "self" as const,
  data: {
    _id: "u001",
    firstName: "Minh",
    lastName: "Nguyễn",
    nickName: "minhng",
    phoneNumber: "0987654321",
    email: "minhnguyen@example.com",
    role: ["user"],
    avatar:
      "https://res.cloudinary.com/dtn9r75b7/image/upload/v1743522634/Avatar/hd7umdemusg8r2l4mwmi.png",
    background:
      "https://res.cloudinary.com/dtn9r75b7/image/upload/v1743522634/Avatar/hd7umdemusg8r2l4mwmi.png",
    gender: true,
    address: "Hà Nội, Việt Nam",
    password: "hashed-password",
    job: "Software Engineer",
    hobbies: "Reading, Coding, Running",
    bio: "Always learning, always growing.",
    point: 1800,
    relationShip: "Single",
    birthDay: "1995-06-15",
    attendDate: "2020-01-01",
    flag: false,
    friendIds: ["f001", "f002"],
    bestFriendIds: ["f001"],
    blockedIds: [],
    postIds: ["p001", "p002"],
    rateIds: ["r001"],
    createAt: "2020-01-01T00:00:00Z",
    createBy: "system"
  }
};
const friendAccountData: AccountData = {
  type: "friend" as const,
  data: {
    _id: "f001",
    firstName: "Hà",
    lastName: "Trần",
    nickName: "hatran",
    phoneNumber: "0911222333",
    email: "hatran@example.com",
    avatar:
      "https://res.cloudinary.com/dtn9r75b7/image/upload/v1743522634/Avatar/hd7umdemusg8r2l4mwmi.png",
    background:
      "https://res.cloudinary.com/dtn9r75b7/image/upload/v1743522634/Avatar/hd7umdemusg8r2l4mwmi.png",
    gender: false,
    address: "TP.HCM, Việt Nam",
    job: "Designer",
    hobbies: "Painting, Music",
    bio: "Design is life.",
    point: 1200,
    relationShip: "In a relationship",
    birthDay: new Date("1998-09-20"),
    attendDate: new Date("2021-06-10"),
    relation: "bff",
    mutualFriends: [
      {
        _id: "mf001",
        firstName: "Linh",
        lastName: "Hoàng",
        nickName: "linhh",
        avatar:
          "https://res.cloudinary.com/dtn9r75b7/image/upload/v1743522634/Avatar/hd7umdemusg8r2l4mwmi.png"
      }
    ]
  }
};

const avatarUrl =
  "https://res.cloudinary.com/dtn9r75b7/image/upload/v1743522634/Avatar/hd7umdemusg8r2l4mwmi.png";

const fakeFile: FileResponseDTO = {
  _id: "f1",
  fileName: "image.png",
  url: avatarUrl,
  bytes: 102400,
  width: 1080,
  height: 1080,
  format: "png",
  type: "Image"
};

const fakePosts: PostResponseDTO[] = [
  {
    _id: "1",
    firstName: "Tiffany",
    lastName: "Young",
    nickName: "tiffanyyoungofficial",
    avatar: avatarUrl,
    userId: "u1",
    likedIds: [],
    shares: [],
    comments: [],
    caption: "Buổi sáng tuyệt vời 🌞",
    createAt: "2025-04-10T08:00:00Z",
    contents: [fakeFile],
    tags: []
  },
  {
    _id: "2",
    firstName: "Tiffany",
    lastName: "Young",
    nickName: "tiffanyyoungofficial",
    avatar: avatarUrl,
    userId: "u1",
    likedIds: [],
    shares: [],
    comments: [],
    caption: "Chill vibes only 🍃",
    createAt: "2025-04-11T14:20:00Z",
    contents: [{ ...fakeFile, _id: "f2" }],
    tags: []
  },
  {
    _id: "3",
    firstName: "Tiffany",
    lastName: "Young",
    nickName: "tiffanyyoungofficial",
    avatar: avatarUrl,
    userId: "u1",
    likedIds: [],
    shares: [],
    comments: [],
    caption: "Lên đồ đi dạo phố 👜",
    createAt: "2025-04-12T18:45:00Z",
    contents: [
      { ...fakeFile, _id: "f3" },
      { ...fakeFile, _id: "f5" }
    ],
    tags: []
  },
  {
    _id: "4",
    firstName: "Tiffany",
    lastName: "Young",
    nickName: "tiffanyyoungofficial",
    avatar: avatarUrl,
    userId: "u1",
    likedIds: [],
    shares: [],
    comments: [],
    caption: "Behind the scenes 🎬",
    createAt: "2025-04-13T21:10:00Z",
    contents: [{ ...fakeFile, _id: "f4" }],
    tags: []
  }
];

const page = () => {
  const { setPostData } = useUserContext();
  useEffect(() => {
    setPostData(fakePosts);
  }, []);
  return (
    <section className="h-screen w-full py-[16px] pr-[16px]">
      <main className="flex w-full h-full overflow-x-auto custom-scrollbar background-light900_dark400  rounded-xl">
        <AccountLayout account={friendAccountData} />
      </main>
    </section>
  );
};

export default page;
