"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { actionSheet } from "@/constants/post";
import ReportCard from "../../shared/ReportCard";
import ConfirmModal, { ConfirmModalProps } from "../../friends/ConfirmModal";
import { toast } from "@/hooks/use-toast";
import { FriendRequestDTO } from "@/lib/DTO/friend";
import { unFriend } from "@/lib/services/friend/unfriend";
import { PostResponseDTO } from "@/lib/DTO/post";
import { CommentResponseDTO } from "@/lib/DTO/comment";
import { handleDelete } from "@/utils/commentUtils";

const ActionSheet = ({
  post,
  comment,
  setIsBack,
  setComments
}: {
  post?: PostResponseDTO;
  comment?: CommentResponseDTO;
  setIsBack: React.Dispatch<React.SetStateAction<boolean>>;
  setComments?: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
}) => {
  const [isReport, setReport] = useState(false);
  const [isUnfr, setIsUnfr] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });

  const handleUnfriend = async () => {
    if (!post) return;
    try {
      const adminId = localStorage.getItem("adminId");
      const friendRequest: FriendRequestDTO = {
        sender: post.userId,
        receiver: adminId || ""
      };
      const result = await unFriend(friendRequest);
      toast({
        title: `Unfriend successfully`,
        className:
          "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
      });
    } catch (error) {
      console.error("Failed to unfriend", error);
      toast({
        title: `Error in unfriend`,
        description: error instanceof Error ? error.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };
  const handleConfirmUnfriend = () => {
    if (!post) return;
    setIsUnfr(true);
    setConfirm({
      setConfirm: setIsUnfr,
      handleAction: handleUnfriend,
      name: post.firstName + " " + post.lastName,
      action: "unfriend"
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (setComments) {
      await handleDelete(commentId, setComments);
      setIsBack(false);
    }
  };
  const adminId = localStorage.getItem("adminId");
  const checkAdminComment = !!(
    comment &&
    adminId &&
    comment.userId === adminId
  ); // ✅ Ép kiểu về boolean

  const actions = checkAdminComment
    ? actionSheet(
        setReport,
        handleConfirmUnfriend,
        setIsBack,
        !!comment,
        checkAdminComment,
        () => handleDeleteComment(comment._id || "")
      )
    : actionSheet(
        setReport,
        handleConfirmUnfriend,
        setIsBack,
        !!comment,
        checkAdminComment // ✅ Đã đảm bảo kiểu boolean
      );

  return (
    <>
      <div className="modal-overlay-post">
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <Button
            className="flex bg-transparent shadow-none p-2 border-none hover:bg-transparent h-10 w-10"
            onClick={() => setIsBack(false)}
          >
            <Icon
              icon="mingcute:close-fill"
              width={40}
              height={40}
              className="text-light-700"
            />
          </Button>
        </div>

        <div className="w-full h-fit flex items-center justify-center">
          <div className="flex flex-col w-[440px] m-5 background-light900_dark200 rounded-lg">
            {actions.map((item, index) => (
              <Button
                key={index}
                onClick={() => item.onClick?.()} // Gọi hàm onClick nếu có
                className={`py-4 w-full h-10 shadow-none  ${
                  index !== actions.length - 1
                    ? "border-b border-light-500"
                    : "border-none"
                }`}
              >
                <p
                  className={`${
                    item.value
                      ? "text-accent-red body-semibold"
                      : "text-dark100_light900 body-regular"
                  }`}
                >
                  {item.label}
                </p>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isReport && (
        <ReportCard
          onClose={() => setReport(false)}
          type="Post"
          reportedId={comment?._id || post?._id || ""}
        />
      )}
      {isUnfr && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default ActionSheet;
