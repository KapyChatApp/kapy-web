"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { group, user } from "@/constants/object";
import MoreTop from "./MoreTop";
import MoreMiddle from "./MoreMiddle";
import MoreBottom from "./MoreBottom";
import {
  ActiveComponentProps,
  SeeAllProps,
  StateType
} from "@/types/mess-group";

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
  const { setActiveComponent, setItemSent, itemSent } = propsAll;
  const pathname = usePathname();
  const idFromPathname = pathname.split("/").pop();
  const userInfo = user.filter((info) => info.id === idFromPathname);
  const groupInfo = group.filter((info) => info.id === idFromPathname);

  const isGroup = /^\/groups\/\d+$/.test(pathname);

  const top = {
    ava: userInfo[userInfo.length - 1].ava,
    name: userInfo[userInfo.length - 1].name
  };

  const topGroup = {
    ava: groupInfo[userInfo.length - 1].ava,
    name: groupInfo[userInfo.length - 1].name
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
        setActiveComponent={setActiveComponent}
        setItemSent={setItemSent}
        itemSent={itemSent}
      />

      <MoreBottom setActiveComponent={setActiveComponent} />
    </div>
  );
};

export default MoreActions;
