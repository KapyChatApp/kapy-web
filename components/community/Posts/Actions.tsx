"use client";
import { PostResponseDTO } from "@/lib/DTO/post";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useState } from "react";
import CommentInput from "../Comment/CommentInput";
import Interaction from "./Interaction";
import DetailLike from "../Other/DetailLike";
import { ShortUserResponseDTO } from "@/lib/DTO/user";

const Actions = ({ post }: { post: PostResponseDTO }) => {
  const totalComments = post.comments.length;
  const [commentContent, setCommentContent] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLike, setIsLike] = useState(false);
  const handleInputChange = (value: string) => {
    setCommentContent(value);
  };
  const [likedUsers, setLikedUsers] = useState(post.likedIds);
  const handleUpdateLikes = (newLikedUsers: ShortUserResponseDTO[]) => {
    setLikedUsers(newLikedUsers);
  };

  return (
    <>
      <div className="w-full h-fit">
        <Interaction post={post} updateLikes={handleUpdateLikes} />

        {/* LIKES */}
        {likedUsers.length > 0 && (
          <section className="flex justify-start items-center w-full h-fit">
            <div className="flex mr-1 h-fit w-fit">
              <a className="flex w-fit h-fit" href="">
                <span className="w-[14px] h-[14px] mx-[2px]">
                  <Image
                    alt="ava"
                    src={
                      likedUsers[0].avatar !== ""
                        ? likedUsers[0].avatar
                        : "/assets/ava/default.png"
                    }
                    width={14}
                    height={14}
                    className="rounded-full object-cover"
                  />
                </span>
              </a>
            </div>

            <div className="flex w-full h-fit justify-start items-center">
              <span className="flex w-full text-dark100_light900 body-regular gap-1">
                Liked by
                <a
                  className="text-dark100_light900 body-semibold"
                  href={`/account/${likedUsers[0]._id}`}
                >
                  {likedUsers[0].firstName + " " + likedUsers[0].lastName}
                </a>
                {likedUsers.length > 1 && " and "}
                {likedUsers.length > 1 && (
                  <div
                    className="flex w-fit h-fit cursor-pointer"
                    onClick={() => setIsLike(true)}
                  >
                    <span className="text-dark100_light900 body-semibold">
                      {likedUsers.length - 1} others
                    </span>
                  </div>
                )}
              </span>
            </div>
          </section>
        )}

        {/* COMMENTS */}
        <section className="flex justify-start items-center w-full h-fit mt-2">
          {totalComments > 0 ? (
            <a
              className="text-dark600_light500 body-light w-fit"
              href={`/community/${post._id}`}
              onClick={() => {
                sessionStorage.setItem(
                  "scrollPosition",
                  window.scrollY.toString()
                );
              }}
            >
              View all {totalComments} comments
            </a>
          ) : (
            <span className="text-dark600_light500 body-light">No comment</span>
          )}
        </section>

        {/* INPUT */}
        <section className="flex justify-start items-center w-full h-fit mt-2">
          <div className="w-full h-fit">
            <div className="w-full h-fit">
              <CommentInput
                onCommentChange={handleInputChange}
                commentContent={commentContent}
                setTyping={setIsTyping}
                /*handleAction={handleAction}*/
              />
            </div>
          </div>
        </section>
      </div>

      {isLike && <DetailLike likedUsers={likedUsers} setIsBack={setIsLike} />}
    </>
  );
};

export default Actions;
