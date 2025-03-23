import React from "react";
import Information from "./Information";
import Content from "./Content";
import { PostResponseDTO } from "@/lib/DTO/post";
import Actions from "./Actions";

const PostFrame = ({ post }: { post: PostResponseDTO }) => {
  return (
    <div className="flex flex-col pb-4 mb-5 border-[0.5px] border-light-700 w-[470px] h-[815px] items-center justify-start">
      <Information post={post} />
      <Content post={post} />
      <Actions post={post} />
    </div>
  );
};

export default PostFrame;
