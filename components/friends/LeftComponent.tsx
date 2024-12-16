"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import ButtonLeft from "./ButtonLeft";
import { useFriendContext } from "@/context/FriendContext";

const LeftComponent = () => {
  const [isList, setList] = useState(true);
  const { listBestFriend, listFriend, listSuggestedFriend } =
    useFriendContext();

  const pathname = usePathname();
  const containsAllFriend = /^\/friends\/all-friend(\/.*)?$/.test(pathname);
  const containsBestFriend = /^\/friends\/best-friend(\/.*)?$/.test(pathname);
  const containsListFriend = containsAllFriend || containsBestFriend;
  const containsSuggestion = /^\/friends\/suggestion(\/.*)?$/.test(pathname);
  const containsRequest = /^\/friends\/request(\/.*)?$/.test(pathname);

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
    number: listFriend.length,
    icon: "",
    isPathname: containsAllFriend,
    route: "all-friend"
  };
  const bestButton = {
    isClick: isList,
    setClick: setList,
    label: "Best",
    number: listBestFriend.length,
    icon: "",
    isPathname: containsBestFriend,
    route: "best-friend"
  };
  const requestButton = {
    isClick: isList,
    setClick: setList,
    label: "Friend requests",
    number: 0,
    icon: "",
    isPathname: containsRequest,
    route: "request"
  };
  const suggestButton = {
    isClick: isList,
    setClick: setList,
    label: "Suggested friends",
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
        <div className="flex flex-row items-start justify-between w-full h-fit">
          <p className="text-xl lg:text-2xl font-medium lg:font-bold text-dark100_light900">
            Your friends
          </p>
          {/* <Button
            className="flex h-full w-fit bg-transparent border-none shadow-none hover:bg-transparent p-0 items"
            onClick={handleIconAdd}
          >
            <Icon
              icon="mdi:user-add"
              width={30}
              height={30}
              className="text-dark-500 dark:text-light-900 lg:h-[30px] lg:w-[30px] md:w-[22px] md:h-[22px] "
            />
          </Button> */}
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
            <ButtonLeft buttonLeft={requestButton} />
          </div>

          <div className="flex w-full h-fit">
            <ButtonLeft buttonLeft={suggestButton} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftComponent;
