"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import ButtonLeft from "./ButtonLeft";
import { user } from "@/constants/object";
import FindFriendModal from "./FindFriendModal";

const LeftComponent = () => {
  const bestUser = user.filter((item) => item.status === "best");

  const [isList, setList] = useState(true);

  const pathname = usePathname();
  const containsAllFriend = /^\/friends\/all-friend(\/.*)?$/.test(pathname);
  const containsBestFriend = /^\/friends\/best-friend(\/.*)?$/.test(pathname);
  const containsListFriend = containsAllFriend || containsBestFriend;
  const containsSuggestion = /^\/friends\/suggestion(\/.*)?$/.test(pathname);
  const containsInvitation = /^\/friends\/invitation(\/.*)?$/.test(pathname);

  const listButton = {
    isClick: isList,
    setClick: setList,
    label: "List friend",
    number: 0,
    icon: "ri:arrow-drop-up-line",
    isPathname: containsListFriend,
    route: ""
  };
  const allButton = {
    isClick: isList,
    setClick: setList,
    label: "All",
    number: user.filter((fr) => fr.status === "" || fr.status === "best")
      .length,
    icon: "",
    isPathname: containsAllFriend,
    route: "all-friend"
  };
  const bestButton = {
    isClick: isList,
    setClick: setList,
    label: "Best",
    number: bestUser.length,
    icon: "",
    isPathname: containsBestFriend,
    route: "best-friend"
  };
  const inviteButton = {
    isClick: isList,
    setClick: setList,
    label: "Friend invitations",
    number: 0,
    icon: "",
    isPathname: containsInvitation,
    route: "invitation"
  };
  const suggestButton = {
    isClick: isList,
    setClick: setList,
    label: "Sugested friends",
    number: 0,
    icon: "",
    isPathname: containsSuggestion,
    route: "suggestion"
  };

  const [isAdd, setAdd] = useState(false);
  const handleIconAdd = () => {
    setAdd(!isAdd);
  };

  return (
    <>
      <div className="flex flex-col p-4 w-full h-full gap-6">
        <div className="flex flex-row items-center justify-between w-full h-fit">
          <p className="h2-medium text-dark100_light900">Your friends</p>
          <Button
            className="flex h-full w-fit bg-transparent border-none shadow-none hover:bg-transparent"
            onClick={handleIconAdd}
          >
            <Icon
              icon="mdi:user-add"
              width={30}
              height={30}
              className="text-dark-500 dark:text-light-900 "
            />
          </Button>
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-col gap-1 w-full h-fit ">
            <ButtonLeft buttonLeft={listButton} />
            {isList && (
              <>
                <div className="flex flex-col w-full h-fit pl-3">
                  <ButtonLeft buttonLeft={allButton} />
                  <ButtonLeft buttonLeft={bestButton} />
                </div>
              </>
            )}
          </div>

          <div className="flex w-full h-fit">
            <ButtonLeft buttonLeft={inviteButton} />
          </div>

          <div className="flex w-full h-fit">
            <ButtonLeft buttonLeft={suggestButton} />
          </div>
        </div>
      </div>

      {isAdd && <FindFriendModal setFind={setAdd} />}
    </>
  );
};

export default LeftComponent;
