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
import { formatTimeMessageBox, getFileFormat } from "@/lib/utils";
import Interaction from "@/components/community/Posts/Interaction";
import { fetchDetailPost } from "@/lib/data/post/detail";
import { FileResponseDTO } from "@/lib/DTO/map";
import CommentArea from "@/components/community/Comment/CommentArea";
import { CommentResponseDTO } from "@/lib/DTO/comment";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { useUserContext } from "@/context/UserContext";
import { handleCreate, handleUpdate } from "@/utils/commentUtils";
import { set } from "date-fns";
import { editComment } from "@/lib/services/post/comment/edit";

const defaultDetail: PostResponseDTO = {
  _id: "",
  firstName: "",
  lastName: "",
  nickName: "",
  avatar: "/assets/ava/default.png",
  userId: "",
  likedIds: [],
  shares: [],
  comments: [],
  caption: "",
  createAt: "2025-01-02T04:47:05.847+00:00",
  contents: [],
  tags: []
};

const page = () => {
  const { id } = useParams();
  const { adminInfo } = useUserContext();
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
  const [replyId, setReplyId] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string>("");
  const [commentList, setCommentList] = useState<CommentResponseDTO[]>(
    detailPost.comments
  );
  const [files, setFiles] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const handleReply = (reply: ShortUserResponseDTO) => {
    setReplyId(reply._id);
    setCommentContent(`@${reply.firstName} ${reply.lastName} `);
  };

  const handleInputChange = (value: string) => {
    setCommentContent(value);
    if (value.trim() === "" || !value.includes("@")) {
      setReplyId("");
    }
  };
  const handleUpdateComment = async () => {
    if (!editingCommentId) return;
    await handleUpdate(
      setCommentList,
      editingCommentId,
      commentContent,
      setEditingCommentId,
      setCommentContent,
      setFiles,
      files
    );
  };

  const handleCommentPost = async () => {
    await handleCreate(
      detailPost._id,
      "post",
      commentContent,
      files,
      adminInfo,
      setCommentList,
      setCommentContent,
      setFiles
    );
  };
  const handleCommentReply = async () => {
    await handleCreate(
      replyId,
      "reply",
      commentContent,
      files,
      adminInfo,
      setCommentList,
      setCommentContent,
      setFiles
    );
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
        setCommentList(data.comments);
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

      <div
        className={`w-full ${
          detailPost.contents.length > 0 ? "max-w-[1054px]" : "max-w-[527px]"
        } h-[683px] rounded-lg background-light900_dark200 flex items-center justify-start`}
      >
        <div className="flex w-full h-full">
          {/* Ảnh bài post */}
          {detailPost.contents.length > 0 && (
            <div className="flex w-1/2 h-full">
              <SwiperDetailPost contents={detailPost.contents} />
            </div>
          )}

          {/* Phần chi tiết bài post + comment */}
          <div
            className={`flex flex-col ${
              detailPost.contents.length > 0 ? "w-1/2" : "w-full"
            } h-full`}
          >
            {/* Header */}
            <div className="flex h-[56px]">
              <Header post={detailPost} />
            </div>

            {/* Detail (Chiều rộng cố định, có thể scroll) */}
            <div className="flex flex-col flex-grow w-full max-w-[600px] px-4 overflow-scroll scrollable">
              <ul className="flex flex-col py-4 w-full">
                {/* Caption */}
                {detailPost.caption && (
                  <CaptionCard
                    userId={detailPost.userId}
                    avatar={detailPost.avatar}
                    accountName={
                      detailPost.firstName + " " + detailPost.lastName
                    }
                    caption={detailPost.caption}
                    tags={detailPost.tags}
                    createAt={detailPost.createAt}
                  />
                )}

                {/* Comments */}
                {commentList.length > 0 && (
                  <Comments
                    comments={commentList}
                    setComments={setCommentList}
                    setEditingCommentId={setEditingCommentId}
                    onReply={handleReply}
                  />
                )}
              </ul>
            </div>

            {/* Interaction + Ô nhập comment (luôn ở dưới) */}
            <div className="w-full">
              {/* Interaction */}
              <div className="flex flex-col w-full px-4 border-t-[0.6px] border-light500_dark400">
                <div className="w-full flex pt-[2px] pb-1">
                  <Interaction post={detailPost} />
                </div>
                <div className="w-full mb-4">
                  <span className="text-dark600_light600 small-regular">
                    {formatTimeMessageBox(detailPost.createAt)}
                  </span>
                </div>
              </div>

              {/* Ô nhập comment */}
              <div className="w-full flex py-[6px] pr-4 border-t-[0.6px] border-light500_dark400">
                {!editingCommentId ? (
                  <CommentArea
                    variant="detail"
                    onCommentChange={handleInputChange}
                    commentContent={commentContent}
                    setTyping={setIsTyping}
                    files={files}
                    setFiles={setFiles}
                    handleAction={
                      replyId ? handleCommentReply : handleCommentPost
                    }
                  />
                ) : (
                  <CommentArea
                    variant="edit"
                    onCommentChange={handleInputChange}
                    commentContent={commentContent}
                    setTyping={setIsTyping}
                    setEditingCommentId={setEditingCommentId}
                    files={files}
                    setFiles={setFiles}
                    handleAction={handleUpdateComment}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default page;
