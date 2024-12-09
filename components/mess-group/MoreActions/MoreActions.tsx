"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { group, user } from "@/constants/object";
import MoreTop from "./MoreTop";
import MoreMiddle from "./MoreMiddle";
import MoreBottom from "./MoreBottom";
import { ActiveComponentProps, SeeAllProps } from "@/types/mess-group";
import { MessageBoxInfo } from "@/lib/dataBox";

interface MoreActionsProps {
  propsAll: SeeAllProps;
  setClickOtherRight?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
  openMore?: boolean;
}

const MoreActions = ({
  propsAll,
  setClickOtherRight,
  setOpenMore,
  openMore
}: MoreActionsProps) => {
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

  return isGroup ? (
    <div className="flex flex-col w-full h-fit items-center justify-center p-1">
      <MoreTop
        top={topGroup}
        setActiveComponent={setActiveComponent}
        setOpenMore={setOpenMore}
        setClickOtherRight={setClickOtherRight}
      />

      <MoreMiddle
        detailByBox={detailByBox}
        setActiveComponent={setActiveComponent}
        setItemSent={setItemSent}
        itemSent={itemSent}
      />
      <MoreBottom setActiveComponent={setActiveComponent} />
    </div>
  ) : (
    <div className="flex flex-col w-full h-fit items-center justify-center p-1">
      <MoreTop
        top={top}
        setActiveComponent={setActiveComponent}
        setOpenMore={setOpenMore}
        setClickOtherRight={setClickOtherRight}
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
