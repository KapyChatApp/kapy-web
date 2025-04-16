"use client";
import { PostResponseDTO } from "@/lib/DTO/post";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Interaction from "./Interaction";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { useUserContext } from "@/context/UserContext";
import { CommentResponseDTO } from "@/lib/DTO/comment";
import CommentArea from "../Comment/CommentArea";
import { handleCreate } from "@/utils/commentUtils";
import DetailListUser from "../../shared/modal/DetailListUser";

const Actions = ({ post }: { post: PostResponseDTO }) => {
  const { adminInfo } = useUserContext();
  const totalComments = post.comments.length;
  const [commentContent, setCommentContent] = useState("");
  const [newComment, setNewComment] = useState<CommentResponseDTO[]>([]);
  const mergedComments = useMemo(
    () => [...post.comments, ...newComment],
    [post.comments, newComment]
  );

  const [files, setFiles] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLike, setIsLike] = useState(false);
  const handleInputChange = (value: string) => {
    setCommentContent(value);
  };
  const [likedUsers, setLikedUsers] = useState(post.likedIds);
  const handleUpdateLikes = (newLikedUsers: ShortUserResponseDTO[]) => {
    setLikedUsers(newLikedUsers);
  };

  const handleCommentPost = async () => {
    await handleCreate(
      post._id,
      "post",
      commentContent,
      files,
      adminInfo,
      setNewComment,
      setCommentContent,
      setFiles
    );
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
                <span className="w-[14px] h-[14px] mx-[2px] rounded-full overflow-hidden">
                  <Image
                    alt="ava"
                    src={
                      likedUsers[0].avatar !== ""
                        ? likedUsers[0].avatar
                        : "/assets/ava/default.png"
                    }
                    width={14}
                    height={14}
                    className="w-full h-full object-cover"
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
          {mergedComments.length > 0 ? (
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
              View all {mergedComments.length} comments
            </a>
          ) : (
            <span className="text-dark600_light500 body-light">No comment</span>
          )}
        </section>

        {/* NEW COMMENTS */}
        {newComment.length > 0 && (
          <section className="flex flex-col justify-start items-center w-full h-fit">
            {newComment.map((item) => (
              <div className="flex flex-col w-full h-fit items-start">
                <div className="flex-grow w-full h-full items-center justify-center flex mt-2">
                  <div className="w-fit h-full flex p-[2px]">
                    <span className="w-full text-dark100_light900 body-semibold">
                      <a
                        className="w-fit transition-opacity duration-300 hover:opacity-40"
                        href={`/account/${adminInfo._id}`}
                      >
                        {adminInfo.firstName + " " + adminInfo.lastName}
                      </a>
                    </span>
                  </div>

                  <div className="flex-grow h-fit w-auto flex items-center justify-start ml-1">
                    <h2 className="text-dark100_light900 body-regular items-center justify-start">
                      {item.caption}
                    </h2>
                  </div>
                </div>

                {item.content && (
                  <div className="flex w-full h-fit items-center justify-start mt-1">
                    <div
                      key={item.content._id}
                      className="w-24 h-36 relative group"
                    >
                      {item.content.type.includes("image") ? (
                        <img
                          src={item.content.url}
                          alt="preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={item.content.url}
                          className="w-full h-full object-cover rounded-lg"
                          controls
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* INPUT */}
        <section className="flex justify-start items-center w-full h-fit mt-2">
          <div className="w-full h-fit">
            <div className="w-full h-fit pb-4 border-b-[0.5px] border-light-500">
              <CommentArea
                variant="default"
                onCommentChange={handleInputChange}
                commentContent={commentContent}
                setTyping={setIsTyping}
                files={files}
                setFiles={setFiles}
                handleAction={handleCommentPost}
              />
            </div>
          </div>
        </section>
      </div>

      {isLike && (
        <DetailListUser list={likedUsers} setIsBack={setIsLike} label="Likes" />
      )}
    </>
  );
};

export default Actions;
