"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useChatContext } from "@/context/ChatContext";

export interface Actions {
  icon: string;
  label: string;
  click: string;
}
const actionsButton: Actions[] = [
  {
    icon: "clarity:notification-solid",
    label: "Turn off",
    click: "notified"
  },
  {
    icon: "ic:baseline-search",
    label: "Find",
    click: "find"
  },
  {
    icon: "ri:shake-hands-fill",
    label: "Best friend",
    click: "best"
  },
  {
    icon: "solar:user-block-bold",
    label: "Block",
    click: "block"
  },
  {
    icon: "weui:add-friends-filled",
    label: "Add mems",
    click: "add"
  },
  {
    icon: "lets-icons:setting-fill",
    label: "Manage",
    click: "manage"
  }
];

interface MoreTopProps {
  ava: string;
  name: string;
  id?: string;
  relation: string;
  setRelation: React.Dispatch<React.SetStateAction<string>>;
}
interface Top {
  top: MoreTopProps;
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
}

const MoreTop: React.FC<Top> = ({ top, setActiveComponent }) => {
  const pathname = usePathname();
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);
  const { ava, name, relation, setRelation, id } = top;
  const [adminId, setAdminId] = useState("");
  const { createBy } = useChatContext();
  useEffect(() => {
    const id = localStorage.getItem("adminId");
    if (id) setAdminId(id);
  });
  return isGroup ? (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-fit gap-[12px]">
      <div className="flex items-start md:justify-center justify-start w-full h-fit">
        <div className="flex flex-col items-center justify-center w-full h-fit gap-[12px]">
          <Image
            src={ava}
            alt="ava"
            width={80}
            height={80}
            className="rounded-full"
          />
          <p className="paragraph-regular text-dark100_light900">{name}</p>
        </div>
      </div>
      <div className="flex items-center md:justify-between justify-center gap-3 md:gap-0 w-full h-fit">
        {createBy === adminId
          ? actionsButton
              .filter(
                (action) => action.click !== "best" && action.click !== "block"
              )
              .map((item) => (
                <ActionButton
                  action={item}
                  setActiveComponent={setActiveComponent}
                />
              ))
          : actionsButton
              .filter(
                (action) =>
                  action.click !== "best" &&
                  action.click !== "block" &&
                  action.click !== "manage"
              )
              .map((item) => (
                <ActionButton
                  action={item}
                  setActiveComponent={setActiveComponent}
                />
              ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-fit gap-[12px]">
      <div className="flex items-start md:justify-center justify-start w-full h-fit">
        <div className="flex flex-col items-center justify-center w-full h-fit gap-[12px]">
          <Image
            src={ava ? ava : "/assets/ava/default.png"}
            alt="ava"
            width={80}
            height={80}
            className="rounded-full"
          />
          <p className="paragraph-regular text-dark100_light900">{name}</p>
        </div>
      </div>
      <div className="flex items-center md:justify-between w-full h-fit justify-center gap-3 md:gap-0">
        {actionsButton
          .filter(
            (action) => action.click !== "add" && action.click !== "manage"
          )
          .map((item) => (
            <ActionButton
              action={item}
              setActiveComponent={setActiveComponent}
              setRelation={setRelation}
              relation={relation}
              userId={id}
            />
          ))}
      </div>
    </div>
  );
};

export default MoreTop;
