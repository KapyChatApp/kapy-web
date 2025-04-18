"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import ActionSheet from "./ActionSheet";
import { PostResponseDTO } from "@/lib/DTO/post";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CommentResponseDTO } from "@/lib/DTO/comment";
import { ShortUserResponseDTO } from "@/lib/DTO/user";

const OtherButton = ({
  post,
  comment,
  user,
  setComments,
  setEditingCommentId,
  setPostList
}: {
  post?: PostResponseDTO;
  comment?: CommentResponseDTO;
  user?: ShortUserResponseDTO;
  setComments?: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setEditingCommentId?: React.Dispatch<React.SetStateAction<string>>;
  setPostList?: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}) => {
  const [isSheet, setIsSheet] = useState(false);
  return (
    <>
      <Button
        className="p-0 shadow-none border-none h-fit"
        onClick={() => setIsSheet(!isSheet)}
      >
        <Icon
          icon="basil:other-1-outline"
          width={24}
          height={24}
          className="text-dark100_light900"
        />
      </Button>
      {isSheet && (
        <ActionSheet
          post={post}
          setIsBack={setIsSheet}
          comment={comment}
          user={user}
          setComments={setComments}
          setEditingCommentId={setEditingCommentId}
          setPostList={setPostList}
        />
      )}
    </>
  );
};

export default OtherButton;
