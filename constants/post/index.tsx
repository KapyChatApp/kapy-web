import { ActionItem } from "@/types/post";

export const actionSheet = (
  setReport: (val: boolean) => void,
  handleUnfriend?: () => void,
  setIsBack?: (val: boolean) => void,
  isComment = false,
  isAdmin = false,
  handleDelete?: () => void,
  handleEdit?: () => void
): ActionItem[] => {
  if (isAdmin) {
    return [
      {
        label: "Delete",
        value: true,
        onClick: handleDelete
      },
      ...(isComment
        ? [
            {
              label: "Edit",
              onClick: handleEdit
            }
          ]
        : handleEdit
        ? [
            {
              label: "Edit",
              onClick: handleEdit
            }
          ]
        : []),
      {
        label: "Cancel",
        onClick: () => setIsBack?.(false)
      }
    ];
  }

  const defaultActions = [
    {
      label: "Report",
      value: true,
      onClick: () => setReport(true)
    }
  ];

  if (!isComment && handleUnfriend) {
    defaultActions.push({
      label: "Unfriend",
      value: true,
      onClick: handleUnfriend
    });
  }

  defaultActions.push({
    label: "Cancel",
    value: false,
    onClick: () => setIsBack?.(false)
  });

  return defaultActions;
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
