"use client";
import PostForm from "@/components/community/Posts/Create-Edit/PostForm";
import { fetchDetailPost } from "@/lib/data/post/detail";
import { PostResponseDTO } from "@/lib/DTO/post";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const { id } = useParams();
  const [post, setPost] = useState<PostResponseDTO | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await fetchDetailPost(id.toString());
        if (!post) {
          console.error("Can't get a post.");
          return;
        }
        setPost(post);
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  return (
    <PostForm
      post={post}
      isEdit={true}
      onFinish={() => router.push(`/community/${post?._id}`)}
    />
  );
};

export default page;
