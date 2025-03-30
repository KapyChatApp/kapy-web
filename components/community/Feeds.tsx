"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import PostFrame from "./Posts/PostFrame";
import { PostResponseDTO } from "@/lib/DTO/post";
import { Icon } from "@iconify/react/dist/iconify.js";
import CreatePost from "./Posts/Create/CreatePost";
import { fetchPosts } from "@/lib/data/post/dataPost";
import { ShortUserResponseDTO } from "@/lib/DTO/user";

const Feeds = () => {
  const [arrayPost, setArrayPost] = useState<PostResponseDTO[]>([]);
  const [detailLike, setDetailLike] = useState<ShortUserResponseDTO[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) return;
      try {
        const data: PostResponseDTO[] = await fetchPosts(1, 10);
        setArrayPost(data);
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    fetchData();
  }, []);

  const [isCreate, setIsCreate] = useState(false);
  const handleCreatePost = () => {
    setIsCreate(!isCreate);
  };
  return (
    <>
      <div className="flex flex-col w-full h-full ">
        <div className="flex w-full h-fit items-center justify-between mb-6 pr-4">
          <span className="text-xl lg:text-2xl font-medium lg:font-bold text-dark100_light900">
            Feeds
          </span>
          <div className="flex w-fit h-fit gap-2 items-center justify-center">
            <Button
              className="bg-primary-500 p-3 border-none shadow-none rounded-2xl hover:bg-primary-500 items-center justify-center"
              onClick={handleCreatePost}
            >
              <div className="flex items-center justify-center h-full">
                <div className="flex w-4 h-full items-center justify-center mr-1">
                  <Icon
                    icon="basil:add-outline"
                    width={16}
                    height={16}
                    className="text-light-900"
                  />
                </div>
                <span
                  className={`flex items-center justify-center h-full body-regular text-light-900`}
                >
                  Create Post
                </span>
              </div>
            </Button>
          </div>
        </div>

        <div className="flex flex-col w-full h-full items-center justify-start overflow-scroll custom-scrollbar">
          {arrayPost.map((item) => (
            <PostFrame post={item} />
          ))}
          {/* <PostFrame post={detailPost} /> */}
        </div>
      </div>

      {isCreate && <CreatePost setIsCreate={setIsCreate} />}
    </>
  );
};

export default Feeds;
