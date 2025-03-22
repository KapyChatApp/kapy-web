"use client";
import SwiperDetailPost from "@/components/shared/Swiper/SwiperDetailPost";
import { Button } from "@/components/ui/button";
import { PostResponseDTO } from "@/lib/DTO/post";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/community/Posts/DetailPost/Header";
import CaptionCard from "@/components/community/Posts/DetailPost/Caption";
import Comments from "@/components/community/Posts/DetailPost/Comments";
import { formatTimeMessageBox } from "@/lib/utils";
import Interaction from "@/components/community/Posts/Interaction";
import InputDetail from "@/components/community/Comment/InputDetail";
import { fetchDetailPost } from "@/lib/data/post/detail";

const defaultDetail: PostResponseDTO = {
  _id: "1",
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
      nickName: "",
      avatar:
        "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png"
    },
    {
      _id: "2",
      firstName: "mei",
      lastName: "truyn",
      nickName: "",
      avatar:
        "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png"
    },
    {
      _id: "3",
      firstName: "bay",
      lastName: "max",
      nickName: "",
      avatar:
        "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png"
    }
  ],
  shares: [],
  comments: [],
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
      _id: "4", // Fix trùng ID
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
  const { id } = useParams();
  const [detailPost, setDetailPost] = useState<PostResponseDTO>(defaultDetail);
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
  const [commentContent, setCommentContent] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const handleInputChange = (value: string) => {
    setCommentContent(value);
  };
  useEffect(() => {
    const fetchDetail = async () => {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) return;
      try {
        const data = await fetchDetailPost(id.toString());
        if (!data) {
          console.error("Can't get a post.");
          return;
        }
        setDetailPost(data);
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    fetchDetail();
  }, []);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted ? (
    <div className="modal-overlay-post">
      {/* Close Button */}
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

      <div className="w-full max-w-[1054px] h-[683px] rounded-lg background-light900_dark200 flex items-center justify-start">
        <div className="flex w-full h-full">
          {/* Ảnh bài post */}
          <div className="flex w-1/2 h-full">
            <SwiperDetailPost contents={detailPost.contents} />
          </div>

          {/* Phần chi tiết bài post + comment */}
          <div className="flex flex-col w-1/2 h-full">
            {/* Header */}
            <div className="flex h-[56px]">
              <Header post={detailPost} />
            </div>

            {/* Detail (Chiều rộng cố định, có thể scroll) */}
            <div className="flex flex-col flex-grow w-full max-w-[600px] px-4 overflow-y-auto">
              <ul className="flex flex-col py-4 w-full overflow-hidden">
                {/* Caption */}
                {detailPost.caption && (
                  <CaptionCard
                    userId={detailPost.userId}
                    avatar={detailPost.avatar}
                    accountName={
                      detailPost.firstName + " " + detailPost.lastName
                    }
                    caption={detailPost.caption}
                    createAt={detailPost.createAt}
                  />
                )}

                {/* Comments */}
                {detailPost.comments.length > 0 && (
                  <Comments comments={detailPost.comments} />
                )}
              </ul>
            </div>

            {/* Interaction + Ô nhập comment (luôn ở dưới) */}
            <div className="w-full">
              {/* Interaction */}
              <div className="flex flex-col w-full px-4 border-t-[0.6px] border-light500_dark400">
                <div className="w-full flex pt-[2px] pb-1">
                  <Interaction />
                </div>
                <div className="w-full mb-4">
                  <span className="text-dark600_light600 small-regular">
                    {formatTimeMessageBox(detailPost.createAt)}
                  </span>
                </div>
              </div>

              {/* Ô nhập comment */}
              <div className="w-full flex py-[6px] pr-4 border-t-[0.6px] border-light500_dark400">
                <InputDetail
                  onCommentChange={handleInputChange}
                  commentContent={commentContent}
                  setTyping={setIsTyping}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default page;
