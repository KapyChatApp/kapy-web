import React from "react";
import Information from "./Information";
import Content from "./Content";
import { PostResponseDTO } from "@/lib/DTO/post";
import Actions from "./Actions";

const PostFrame = ({
  post,
  setArrayPost
}: {
  post: PostResponseDTO;
  setArrayPost?: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}) => {
  return (
    <div className="flex flex-col mb-5 w-[470px] h-fit items-center justify-start">
      <Information post={post} setArrayPost={setArrayPost} />
      <Content post={post} />
      <Actions post={post} />
    </div>
  );
};

export default PostFrame;
