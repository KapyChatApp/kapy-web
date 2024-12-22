import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const ActionButton = ({
  params: { label, icon, colorBackground, colorText, handleAction }
}: {
  params: {
    label: string;
    icon: string;
    colorBackground: string;
    colorText: string;
    handleAction: () => void;
  };
}) => {
  return (
    <Button
      className={`flex w-fit h-full ${colorBackground} hover:${colorBackground}  border-none shadow-none py-[6px] px-3 rounded-lg gap-1`}
      onClick={handleAction}
    >
      {icon !== "" && (
        <Icon icon={icon} width={14} height={14} className={colorText} />
      )}
      <p className={colorText}>{label}</p>
    </Button>
  );
};

export default ActionButton;
