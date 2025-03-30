export const actionSheet = (
  setReport: (value: boolean) => void,
  handleConfirmUnfriend: () => void,
  setIsBack: (value: boolean) => void,
  isComment: boolean,
  checkAdminComment: boolean,
  handleDeleteComment?: () => void,
  handleGetEditingCommentId?: () => void
) => {
  const actions = [
    {
      label: checkAdminComment ? "Delete" : "Report",
      value: true,
      onClick: checkAdminComment ? handleDeleteComment : () => setReport(true)
    }
  ];

  if (isComment && checkAdminComment && handleGetEditingCommentId) {
    actions.push({
      label: "Edit",
      value: true,
      onClick: handleGetEditingCommentId
    });
  }

  if (!isComment) {
    actions.push({
      label: "Unfriend",
      value: true,
      onClick: handleConfirmUnfriend
    });
  }

  actions.push({
    label: "Cancel",
    value: false,
    onClick: () => setIsBack(false)
  });

  return actions;
};

export const iconInteraction = (
  handleLikeClick: () => void,
  handleCommentClick: () => void,
  setShared: (value: boolean) => void
) => {
  const actions = [
    {
      icon: "solar:heart-linear",
      value: "react",
      onClick: handleLikeClick // Gọi hàm handleLikeClick thay vì setLiked
    },
    {
      icon: "lineicons:comment-1",
      value: "comment",
      onClick: handleCommentClick
    },
    {
      icon: "f7:paperplane",
      value: "share",
      onClick: () => setShared(true)
    }
  ];

  return actions;
};
