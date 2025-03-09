"use client";
import { PostResponseDTO } from "@/lib/DTO/post";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useState } from "react";
import CommentInput from "./CommentInput";

const interationItem = [
  { icon: "solar:heart-linear", value: "react" },
  { icon: "lineicons:comment-1", value: "comment" },
  { icon: "f7:paperplane", value: "share" }
];

const Interaction = ({ post }: { post: PostResponseDTO }) => {
  const totalComments = post.comments.length;
  const totalLikes = post.likedIds.length;
  const [commentContent, setCommentContent] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const handleInputChange = (value: string) => {
    setCommentContent(value);
  };
  const handleLikeInformation = () => {};

  return (
    <div className="w-full h-fit">
      <section className="flex justify-start items-center w-full h-fit my-1 ml-[-8px]">
        {interationItem.map((item) => (
          <span className="w-fit h-fit flex cursor-pointer p-2">
            <Icon
              icon={item.icon}
              width={24}
              height={24}
              className="text-dark100_light900"
            />
          </span>
        ))}
      </section>

      {/* LIKES */}
      {post.likedIds.length > 0 && (
        <section className="flex justify-start items-center w-full h-fit">
          <div className="flex mr-1 h-fit w-fit">
            <a className="flex w-fit h-fit" href="">
              <span className="w-[14px] h-[14px] mx-[2px]">
                <Image
                  alt="ava"
                  src={post.likedIds[0].avatar}
                  width={14}
                  height={14}
                  className="rounded-full"
                />
              </span>
            </a>
          </div>

          <div className="flex w-full h-fit justify-start items-center">
            <span className="flex w-full text-dark100_light900 body-regular gap-1">
              Liked by
              <a className="text-dark100_light900 body-semibold" href="">
                {post.likedIds[0].firstName + " " + post.likedIds[0].lastName}
              </a>
              {totalLikes > 1 && " and "}
              {totalLikes > 1 && (
                <div
                  className="flex w-fit h-fit cursor-pointer"
                  onClick={handleLikeInformation}
                >
                  <span className="text-dark100_light900 body-semibold">
                    {totalLikes - 1} others
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
            href={`/community/post/${post._id}`}
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
  );
};

export default Interaction;
