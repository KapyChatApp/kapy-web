"use client";
import { CommentResponseDTO } from "@/lib/DTO/comment";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import CommentCard from "../../Comment/CommentCard";
import CommentItem from "../../Comment/Replies";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import CommentArea from "../../Comment/CommentArea";

const Comments = ({
  comments,
  setComments,
  setEditingCommentId,
  onReply
}: {
  comments: CommentResponseDTO[];
  setComments: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setEditingCommentId: React.Dispatch<React.SetStateAction<string>>;
  onReply: (user: ShortUserResponseDTO) => void;
}) => {
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const toggleReplies = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const [visibleComments, setVisibleComments] = useState(10);
  const sortedComments = useMemo(
    () =>
      [...comments].sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      ),
    [comments]
  );

  // Load thêm 10 comment khi nhấn
  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 10);
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full h-full items-center justify-start">
        {sortedComments.slice(0, visibleComments).map((item) => (
          <div className="w-full h-fit mb-4 group relative">
            <ul className="flex flex-col w-full h-fit">
              {/* Parent */}
              <div className="w-full h-fit">
                <CommentCard
                  item={item}
                  onReply={onReply}
                  setComments={setComments}
                  setEditingCommentId={setEditingCommentId}
                />
              </div>
              {/* View Replies */}
              {item.replieds.length > 0 && (
                <li>
                  <ul className="mt-4 ml-[50px]">
                    <li className="w-fit">
                      <div className="flex w-fit h-fit items-center justify-center">
                        <Button
                          className="p-0 bg-transparent shadow-none border-none h-fit w-fit"
                          onClick={() => toggleReplies(item._id)}
                        >
                          <span className="w-[24px] h-[1px] background-dark600_light600 mr-4"></span>
                          <div className="w-fit h-fit mr-1 text-dark600_light600 small-semibold">
                            {expandedComments[item._id]
                              ? "Hide Replies"
                              : "View Replies"}
                          </div>
                          <div className="w-fit h-fit text-dark600_light600 small-semibold">
                            ({item.replieds.length})
                          </div>
                        </Button>
                      </div>
                    </li>
                  </ul>
                </li>
              )}

              {/* Danh sách phản hồi */}
              {expandedComments[item._id] && item.replieds.length > 0 && (
                <ul className="mt-2 flex flex-col items-start">
                  {item.replieds.map((reply) => (
                    <CommentItem
                      key={reply._id}
                      item={reply}
                      level={1}
                      onReply={onReply}
                      setComments={setComments}
                      setEditingCommentId={setEditingCommentId}
                    />
                  ))}
                </ul>
              )}
            </ul>
          </div>
        ))}

        {/* Load More */}
        {visibleComments < sortedComments.length && (
          <li className="w-full">
            <div
              className="flex items-center justify-center w-full h-fit p-2 cursor-pointer"
              onClick={loadMoreComments}
            >
              <Icon
                icon="gg:add"
                width={24}
                height={24}
                className="text-dark100_light900"
              />
            </div>
          </li>
        )}
      </div>
    </div>
  );
};

export default Comments;
