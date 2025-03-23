"use client";
import { iconInteraction } from "@/constants/post";
import { useUserContext } from "@/context/UserContext";
import { PostResponseDTO } from "@/lib/DTO/post";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { dislikePost } from "@/lib/services/post/dislike";
import { likePost } from "@/lib/services/post/like";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Interaction = ({
  post,
  updateLikes
}: {
  post: PostResponseDTO;
  updateLikes?: (newLikedUsers: ShortUserResponseDTO[]) => void;
}) => {
  const router = useRouter();
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
    let updatedLikes;

    if (liked) {
      setLiked(false);
      updatedLikes = post.likedIds.filter((item) => item._id !== userId);
      await dislikePost(post._id);
    } else {
      setLiked(true);
      updatedLikes = post.likedIds; // Thêm userLike vào danh sách
      await likePost(post._id);
    }
    if (updateLikes) updateLikes(updatedLikes); // Gọi callback để cập nhật Actions
  };

  const handleCommentClick = () => {
    router.push(`/community/${post._id}`);
  };

  const interationItem = iconInteraction(
    handleLikeClick,
    handleCommentClick,
    setShared
  );

  useEffect(() => {
    if (post && post.likedIds && userId) {
      setLiked(post.likedIds.some((user) => user._id === userId));
    }
  }, [post, userId]);

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
