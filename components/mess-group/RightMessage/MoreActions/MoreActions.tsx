"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import MoreTop from "./MoreTop";
import MoreMiddle from "./MoreMiddle";
import MoreBottom from "./MoreBottom";
import { SeeAllProps } from "@/types/mess-group";
import { UserInfoBox } from "@/lib/DTO/message";

interface MoreActionsProps {
  propsAll: SeeAllProps;
  relation: string;
  setRelation: React.Dispatch<React.SetStateAction<string>>;
}

const MoreActions = ({ propsAll, relation, setRelation }: MoreActionsProps) => {
  const { detailByBox, setActiveComponent, setItemSent, itemSent } = propsAll;
  const pathname = usePathname();

  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);

  const top = {
    ava: detailByBox.receiverInfo.avatar,
    name:
      detailByBox.receiverInfo.firstName +
      " " +
      detailByBox.receiverInfo.lastName,
    id: detailByBox.receiverInfo._id,
    relation,
    setRelation
  };

  const topGroup = {
    ava: detailByBox.groupAva,
    name: detailByBox.groupName,
    relation,
    setRelation
  };

  return (
    <div
      className={` flex flex-col w-full ${
        isGroup
          ? "h-fit items-center justify-center"
          : "h-full items-center justify-start gap-7"
      } p-1`}
    >
      <div className="flex w-full h-fit">
        <MoreTop
          top={isGroup ? topGroup : top}
          setActiveComponent={setActiveComponent}
        />
      </div>

      <div className={`flex w-full ${isGroup ? "h-fit" : "h-full"}`}>
        <MoreMiddle
          setActiveComponent={setActiveComponent}
          setItemSent={setItemSent}
        />
      </div>
      <div className="flex w-full h-fit">
        <MoreBottom
          setActiveComponent={setActiveComponent}
          receiver={detailByBox.receiverInfo}
          box={detailByBox}
        />
      </div>
    </div>
  );
};

export default MoreActions;
