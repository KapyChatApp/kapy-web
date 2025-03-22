"use client";
import { iconInteraction } from "@/constants/post";
import { useUserContext } from "@/context/UserContext";
import { PostResponseDTO } from "@/lib/DTO/post";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { dislikePost } from "@/lib/services/post/dislike";
import { likePost } from "@/lib/services/post/like";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const Interaction = ({ post }: { post: PostResponseDTO }) => {
  const userId = localStorage.getItem("adminId");
  const { adminInfo } = useUserContext();
  const userLike: ShortUserResponseDTO = {
    _id: adminInfo._id,
    firstName: adminInfo.firstName,
    lastName: adminInfo.lastName,
    nickName: adminInfo.nickName,
    avatar: adminInfo.avatar
  };
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [shared, setShared] = useState(false);

  const handleLikeClick = async () => {
    if (liked) {
      setLiked(false);
      post.likedIds.push(userLike);
      const result = await dislikePost(post._id);
      if (result) {
        setLiked(false);
      }
    } else {
      setLiked(true);
      post.likedIds.filter((item) => item._id != userId);
      const result = await likePost(post._id);
      if (result) {
        setLiked(true);
      }
    }
  };
  const interationItem = iconInteraction(
    handleLikeClick,
    setCommented,
    setShared
  );

  useEffect(() => {
    if (post && post.likedIds && userId) {
      setLiked(post.likedIds.some((user) => user._id === userId));
    }
  }, [post, userId]); // Không cần dùng post?.likedIds, chỉ cần post là đủ

  return (
    <section className="flex justify-start items-center w-full h-fit my-1 ml-[-8px]">
      {interationItem.map((item) => (
        <span
          className="w-fit h-fit flex cursor-pointer p-2"
          onClick={() => item.onClick?.()}
        >
          {liked && item.value === "react" ? (
            <Icon
              icon="solar:heart-bold"
              width={24}
              height={24}
              className={`text-accent-red`}
            />
          ) : (
            <Icon
              icon={item.icon}
              width={24}
              height={24}
              className={`text-dark100_light900 `}
            />
          )}
        </span>
      ))}
    </section>
  );
};

export default Interaction;
