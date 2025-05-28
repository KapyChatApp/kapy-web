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
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { handleDeleteComment } from "@/utils/commentUtils";
import { handleDeletePost } from "@/utils/postUtils";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

const ActionSheet = ({
  post,
  comment,
  user,
  setIsBack,
  setEditingCommentId,
  setComments,
  setPostList
}: {
  post?: PostResponseDTO;
  comment?: CommentResponseDTO;
  user?: ShortUserResponseDTO;
  setIsBack: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingCommentId?: React.Dispatch<React.SetStateAction<string>>;
  setComments?: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setPostList?: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}) => {
  const { setPostData } = useUserContext();
  const router = useRouter();
  const [isReport, setReport] = useState(false);
  const [isUnfr, setIsUnfr] = useState(false);
  const [isDeletePost, setIsDeletePost] = useState(false);
  const [isDeleteComment, setIsDeleteComment] = useState(false);
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

  // Comments
  const handleDeleteMyComment = async (commentId: string) => {
    if (setComments) {
      await handleDeleteComment(commentId, setComments);
      setIsBack(false);
    }
  };
  const handleConfirmDeleteMyComment = (commentId: string) => {
    if (!comment) return;
    setIsDeleteComment(true);
    setConfirm({
      setConfirm: setIsDeleteComment,
      handleAction: () => handleDeleteMyComment(commentId),
      name: "your comment",
      action: "delete"
    });
  };
  const handleGetEditingCommentId = () => {
    if (comment && setEditingCommentId) {
      setEditingCommentId(comment._id);
      setIsBack(false);
    }
  };

  // Posts
  const searchParams = useSearchParams();
  const encoded = searchParams.get("r");
  const handleDeleteMyPost = async () => {
    if (post) {
      setPostList
        ? await handleDeletePost(post._id, setPostList)
        : await handleDeletePost(post._id, undefined, setPostData);
      setIsBack(false);
    }
    let returnTo = "/community";
    if (encoded) {
      try {
        returnTo = atob(encoded);
      } catch (err) {
        console.warn("Invalid return path");
      }
    }
    router.push(returnTo);
  };

  const handleConfirmDeleteMyPost = () => {
    if (!post) return;
    setIsDeletePost(true);
    setConfirm({
      setConfirm: setIsDeletePost,
      handleAction: handleDeleteMyPost,
      name: "this post",
      action: "delete"
    });
  };
  const handleEditRoute = () => {
    post && router.push(`/community/edit/${post._id}`);
  };
  // const checkAdminComment = !!(
  //   comment &&
  //   adminId &&
  //   comment.userId === adminId
  // ); // ✅ Ép kiểu về boolean

  //   const actions = checkAdminComment
  //     ? actionSheet(
  //         setReport,
  //         handleConfirmUnfriend,
  //         setIsBack,
  //         !!comment,
  //         checkAdminComment,
  //         () => handleDeleteMyComment(comment._id || ""),
  //         handleGetEditingCommentId
  //       )
  //     : actionSheet(
  //         setReport,
  //         handleConfirmUnfriend,
  //         setIsBack,
  //         !!comment,
  //         checkAdminComment // ✅ Đã đảm bảo kiểu boolean
  //       );
  const adminId = localStorage.getItem("adminId");
  const checkAdminPost = post && adminId === post.userId;
  const checkAdminComment = comment && adminId === comment.userId;

  let actions: any[] = [];

  if (user) {
    // 👉 User: chỉ Report + Cancel
    actions = actionSheet(setReport, handleUnfriend, setIsBack, false, false);
  } else if (post) {
    if (checkAdminPost) {
      // 👉 Post do Admin tạo: Delete, Edit, Cancel
      actions = actionSheet(
        setReport,
        undefined,
        setIsBack,
        false,
        true,
        handleConfirmDeleteMyPost,
        handleEditRoute
      );
    } else {
      // 👉 Post của người khác: Report, Unfriend, Cancel
      actions = actionSheet(
        setReport,
        handleConfirmUnfriend,
        setIsBack,
        false,
        false
      );
    }
  } else if (comment) {
    if (checkAdminComment) {
      // 👉 Comment do Admin tạo: Delete, Edit, Cancel
      actions = actionSheet(
        setReport,
        undefined,
        setIsBack,
        true,
        true,
        () => handleConfirmDeleteMyComment(comment._id),
        handleGetEditingCommentId
      );
    } else {
      // 👉 Comment của người khác: Report, Cancel
      actions = actionSheet(setReport, undefined, setIsBack, true, false);
    }
  }

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
          type={post ? "Post" : comment ? "Comment" : user ? "User" : "Unknown"}
          reportedId={comment?._id || post?._id || user?._id || ""}
        />
      )}
      {(isUnfr || isDeleteComment || isDeletePost) && (
        <ConfirmModal confirm={confirm} />
      )}
    </>
  );
};

export default ActionSheet;
