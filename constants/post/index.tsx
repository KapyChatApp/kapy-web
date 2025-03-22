export const actionSheet = (
  setReport: (value: boolean) => void,
  handleConfirmUnfriend: () => void,
  setIsBack: (value: boolean) => void,
  isComment: boolean
) => {
  const actions = [
    {
      label: "Report",
      value: true,
      onClick: () => setReport(true)
    }
  ];

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
  setCommented: (value: boolean) => void,
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
      onClick: () => setCommented(true)
    },
    {
      icon: "f7:paperplane",
      value: "share",
      onClick: () => setShared(true)
    }
  ];

  return actions;
};
