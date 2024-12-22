"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import MoreTop from "./MoreTop";
import MoreMiddle from "./MoreMiddle";
import MoreBottom from "./MoreBottom";
import { SeeAllProps } from "@/types/mess-group";

interface MoreActionsProps {
  propsAll: SeeAllProps;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
}

const MoreActions = ({ propsAll, setOpenMore }: MoreActionsProps) => {
  const { detailByBox, setActiveComponent, setItemSent, itemSent } = propsAll;
  const pathname = usePathname();

  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);

  const top = {
    ava: detailByBox.receiverInfo.avatar,
    name:
      detailByBox.receiverInfo.firstName +
      " " +
      detailByBox.receiverInfo.lastName
  };

  const topGroup = {
    ava: detailByBox.groupAva,
    name: detailByBox.groupName
  };

  return (
    <div className="flex flex-col w-full h-fit items-center justify-center p-1">
      <MoreTop
        top={isGroup ? topGroup : top}
        setActiveComponent={setActiveComponent}
      />

      <MoreMiddle
        detailByBox={detailByBox}
        setActiveComponent={setActiveComponent}
        setItemSent={setItemSent}
        itemSent={itemSent}
      />
      <MoreBottom setActiveComponent={setActiveComponent} />
    </div>
  );
};

export default MoreActions;
