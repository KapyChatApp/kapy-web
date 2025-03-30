"use client";
import { CommentResponseDTO } from "@/lib/DTO/comment";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CommentCard from "./CommentCard";
import { ShortUserResponseDTO } from "@/lib/DTO/user";

const CommentItem = ({
  item,
  level,
  setComments,
  setEditingCommentId,
  onReply
}: {
  item: CommentResponseDTO;
  level: number;
  setComments: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setEditingCommentId: React.Dispatch<React.SetStateAction<string>>;
  onReply: (user: ShortUserResponseDTO) => void;
}) => {
  const [expandedReplies, setExpandedReplies] = useState(
    item.replieds?.length > 0
  );
  const [replyCount, setReplyCount] = useState(item.replieds.length);
  const marginLeft = level > 2 ? "" : "pl-[50px]";

  // Khi số lượng replies thay đổi thì tự động mở replies
  useEffect(() => {
    if (item.replieds.length > replyCount) {
      setExpandedReplies(true);
    }
    setReplyCount(item.replieds.length);
  }, [JSON.stringify(item.replieds)]);

  return (
    <div className={`w-full h-fit ${marginLeft}`}>
      <div className="mt-2">
        <CommentCard
          item={item}
          onReply={onReply}
          setComments={setComments}
          setEditingCommentId={setEditingCommentId}
        />
      </div>

      {/* Hiển thị nút View/Hide Replies nếu có phản hồi */}
      {item.replieds?.length > 0 && (
        <div className="mt-2 ml-[50px]">
          <Button
            className="p-0 bg-transparent shadow-none border-none h-fit w-fit"
            onClick={() => setExpandedReplies(!expandedReplies)}
          >
            <span className="w-[24px] h-[1px] background-dark600_light600 mr-4"></span>
            <div className="w-fit h-fit mr-1 text-dark600_light600 small-semibold">
              {expandedReplies ? "Hide Replies" : "View Replies"}
            </div>
            <div className="w-fit h-fit text-dark600_light600 small-semibold">
              ({item.replieds.length})
            </div>
          </Button>
        </div>
      )}

      {/* Danh sách phản hồi */}
      {expandedReplies && (
        <ul className="mt-2 flex flex-col items-start">
          {item.replieds.map((reply) => (
            <CommentItem
              key={reply._id}
              item={reply}
              level={level + 1}
              onReply={onReply}
              setComments={setComments}
              setEditingCommentId={setEditingCommentId}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentItem;
