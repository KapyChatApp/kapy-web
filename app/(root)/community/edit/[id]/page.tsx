"use client";
import PostForm from "@/components/community/Posts/Create-Edit/PostForm";
import { fetchDetailPost } from "@/lib/data/post/detail";
import { PostResponseDTO } from "@/lib/DTO/post";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const encoded = searchParams.get("r");
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
      onFinish={() => {
        let returnTo = "/community";
        if (encoded) {
          try {
            returnTo = atob(encoded);
          } catch (err) {
            console.warn("Invalid return path");
          }
        }
        router.push(returnTo);
      }}
    />
  );
};

export default page;
