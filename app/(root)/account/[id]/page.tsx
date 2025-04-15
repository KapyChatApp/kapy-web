import AccountLayout from "@/components/account/AccountLayout";
import { AccountData } from "@/types/account";
import React from "react";

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
    relation: "friend",
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

const page = () => {
  return (
    <section className="h-screen w-full py-[16px] pr-[16px]">
      <main className="flex w-full h-full overflow-x-auto custom-scrollbar background-light900_dark400  rounded-xl">
        <AccountLayout account={friendAccountData} />
      </main>
    </section>
  );
};

export default page;
