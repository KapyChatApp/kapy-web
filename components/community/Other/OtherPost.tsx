"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import ActionSheet from "./ActionSheet";
import { PostResponseDTO } from "@/lib/DTO/post";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CommentResponseDTO } from "@/lib/DTO/comment";

const OtherPost = ({
  post,
  comment,
  setComments,
  setEditingCommentId
}: {
  post?: PostResponseDTO;
  comment?: CommentResponseDTO;
  setComments?: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setEditingCommentId?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isBack, setIsBack] = useState(false);
  return (
    <>
      <Button
        className="p-0 shadow-none border-none h-fit"
        onClick={() => setIsBack(!isBack)}
      >
        <Icon
          icon="basil:other-1-outline"
          width={24}
          height={24}
          className="text-dark100_light900"
        />
      </Button>
      {isBack && (
        <ActionSheet
          post={post}
          setIsBack={setIsBack}
          comment={comment}
          setComments={setComments}
          setEditingCommentId={setEditingCommentId}
        />
      )}
    </>
  );
};

export default OtherPost;
