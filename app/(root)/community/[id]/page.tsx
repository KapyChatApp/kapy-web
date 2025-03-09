"use client";
import SwiperDetailPost from "@/components/shared/Swiper/SwiperDetailPost";
import { Button } from "@/components/ui/button";
import { PostResponseDTO } from "@/lib/DTO/post";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { otherBoxPost } from "@/constants/post";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/community/Posts/DetailPost/Header";
import AccountLink from "@/components/community/Posts/DetailPost/AccountLink";

const detailPost: PostResponseDTO = {
  _id: "1",
  firstName: "Junie",
  lastName: "Vu",
  nickName: "",
  avatar:
    "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png",
  userId: "1",
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
const page = () => {
  const [isPop, setPop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const handleBack = () => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    router.back();

    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition, 10));
      }, 100); // Đợi một chút để đảm bảo trang cũ được tải lại trước khi cuộn
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted ? (
    <div className="modal-overlay-post">
      <div className="absolute top-4 right-4">
        <Button
          className="flex bg-transparent shadow-none p-2 border-none hover:bg-transparent h-10 w-10"
          onClick={handleBack}
        >
          <Icon
            icon="mingcute:close-fill"
            width={40}
            height={40}
            className="text-light-700"
          />
        </Button>
      </div>
      <div className="w-full mx-48 h-[683px] rounded-lg background-light900_dark200 items-center justify-start flex overflow-scroll scrollable">
        <div className="flex w-full h-full">
          <div className="flex w-1/2 h-full">
            <SwiperDetailPost contents={detailPost.contents} />
          </div>

          <div className="flex-grow h-full flex-col">
            <Header
              avatar={detailPost.avatar}
              userId={detailPost.userId}
              accountName={detailPost.firstName + " " + detailPost.lastName}
            />

            {/* Detail */}
            <div className="flex p-4 w-full h-fit items-center justify-start border-b-[0.6px] border-light500_dark400">
              <div className="flex w-full h-fit">
                <div className="w-8 h-8">
                  <a className="w-8 h-8" href={`/account/${detailPost.userId}`}>
                    <Image
                      alt="ava"
                      src={detailPost.avatar}
                      width={32}
                      height={32}
                      className="object-cover rounded-full"
                    />
                  </a>
                </div>
                <div className="flex-grow w-full h-full items-start justify-center ml-[14px]">
                  <div className="w-full h-full flex p-[2px]">
                    <span className="w-full text-dark100_light900 body-semibold">
                      <a
                        className="w-fit transition-opacity duration-300 hover:opacity-40"
                        href={`/account/${detailPost.userId}`}
                      >
                        {detailPost.firstName + " " + detailPost.lastName}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default page;
