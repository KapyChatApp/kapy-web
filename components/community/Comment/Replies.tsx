"use client";
import { CommentResponseDTO } from "@/lib/DTO/comment";
import { formatTimeMessageBox } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import CommentCard from "./CommentCard";

const CommentItem = ({
  item,
  level
}: {
  item: CommentResponseDTO;
  level: number;
}) => {
  const marginLeft = level === 1 ? "ml-[50px]" : "ml-[100px]";
  return (
    <div className={`w-full h-fit ${marginLeft}`}>
      <CommentCard item={item} />

      {/* Hiển thị các phản hồi lồng nhau */}
      {item.replieds?.length > 0 && (
        <ul>
          {item.replieds.map((reply) => (
            <CommentItem key={reply._id} item={reply} level={level + 1} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentItem;
