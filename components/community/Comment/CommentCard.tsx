"use client";
import { Button } from "@/components/ui/button";
import { CommentResponseDTO } from "@/lib/DTO/comment";
import { formatTimeMessageBox } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { handleDislikeComment, handleLikeComment } from "@/utils/commentUtils";
import OtherButton from "../Other/OtherButton";

const CommentCard = ({
  item,
  setComments,
  onReply,
  setEditingCommentId
}: {
  item: CommentResponseDTO;
  setComments: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setEditingCommentId: React.Dispatch<React.SetStateAction<string>>;
  onReply: (user: ShortUserResponseDTO) => void;
}) => {
  const userId = localStorage.getItem("adminId");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likedIds.length);
  const repliedInfo: ShortUserResponseDTO = {
    _id: item._id,
    firstName: item.firstName,
    lastName: item.lastName,
    nickName: item.nickName,
    avatar: item.avatar
  };
  const handleReactComment = async () => {
    if (liked) {
      await handleDislikeComment(item._id, setLiked, setLikeCount);
    } else {
      await handleLikeComment(item._id, setLiked, setLikeCount);
    }
  };
  useEffect(() => {
    if (item && item.likedIds && userId) {
      setLiked(item.likedIds.some((user) => user === userId));
    }
  }, [item, userId]);
  return (
    <li className="flex w-full  pt-3 mt-[-5px] mr-[-2px]">
      <div className="flex justify-between items-start w-full">
        <div className="flex w-full h-fit items-start justify-center">
          <div className="flex items-start justify-center mr-[18px]">
            <div className="w-8 h-8">
              <a className="w-8 h-8" href={`/account/${item.userId}`}>
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    alt="ava"
                    src={item.avatar}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
            </div>
          </div>
          <div className="flex-grow w-full h-auto items-center justify-center flex-col">
            <div className="flex-grow w-full h-full items-center justify-center flex">
              <div className="w-fit h-full flex p-[2px]">
                <span className="w-full text-dark100_light900 body-semibold">
                  <a
                    className="w-fit transition-opacity duration-300 hover:opacity-40"
                    href={`/account/${item.userId}`}
                  >
                    {item.firstName + " " + item.lastName}
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
                  {item.content.type.startsWith("image") ||
                  item.content.type === "Image" ? (
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
            <div className="flex items-center justify-start mt-2 mb-1 w-fit h-fit relative">
              <span className="w-auto h-auto flex items-center justify-center">
                <div className="text-dark600_light600 mr-3 small-regular">
                  {formatTimeMessageBox(item.createAt)}
                </div>
                {likeCount > 0 && (
                  <div className="text-dark600_light600 mr-3 small-bold">
                    {likeCount} likes
                  </div>
                )}
                <div className="relative items-center justify-center flex">
                  <Button
                    className="p-0 bg-transparent shadow-none border-none h-fit w-fit mr-3"
                    onClick={() => onReply(repliedInfo)}
                  >
                    <p className="text-dark600_light600 small-bold">Reply</p>
                  </Button>
                  {/* ReportPost xuất hiện bên cạnh Reply */}
                  <div className="absolute left-full top-0 mt-[-2px] hidden group-hover:block ml-2">
                    <OtherButton
                      comment={item}
                      setComments={setComments}
                      setEditingCommentId={setEditingCommentId}
                    />
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
        <span
          className="flex-1 w-4 h-4 mt-[9px] cursor-pointer"
          onClick={handleReactComment}
        >
          {liked ? (
            <Icon
              icon="solar:heart-bold"
              width={16}
              height={16}
              className={`text-accent-red`}
            />
          ) : (
            <Icon
              icon="solar:heart-linear"
              width={16}
              height={16}
              className="
            text-dark100_light900 object-cover"
            />
          )}
        </span>
      </div>
    </li>
  );
};

export default CommentCard;
