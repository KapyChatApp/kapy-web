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
