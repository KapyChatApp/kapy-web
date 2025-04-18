"use client";
import { iconInteraction } from "@/constants/post";
import { PostResponseDTO } from "@/lib/DTO/post";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { handleReactPost } from "@/utils/postUtils";
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
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);

  const handleLikeClick = async () => {
    await handleReactPost(liked, post, userId, setLiked, updateLikes);
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
