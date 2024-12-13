"use client";
import { User } from "@/types/object";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import LocalSearch from "../shared/search/localSearchbar";
import VerticalBox from "./VerticalBox";
import FriendBox from "./FriendBox";
import useSearch from "@/hooks/use-search";
import LeftComponent from "./LeftComponent";
import { useFriendContext } from "@/context/FriendContext";

const RightComponent = () => {
  const { listFriend, listBestFriend, listSuggestedFriend } =
    useFriendContext();

  const [isIndex, setIndex] = useState("");

  const pathname = usePathname();
  const getPathNameMatch = () => {
    const paths = ["all-friend", "best-friend", "suggestion", "invitation"];
    return paths.find((path) =>
      new RegExp(`^/friends/${path}(\\/.*)?$`).test(pathname)
    );
  };
  const matchedPath = getPathNameMatch();

  const label =
    matchedPath === "all-friend"
      ? "Friends"
      : matchedPath === "best-friend"
      ? "Best friends"
      : matchedPath === "suggestion"
      ? "Suggestions"
      : "Invitations";

  let quantity = 0;
  switch (matchedPath) {
    case "all-friend":
      quantity = listFriend.length;
    case "best-friend":
      quantity = listBestFriend.length;
    default:
      quantity = listSuggestedFriend.length;
  }

  const { searchTerm, setSearchTerm, filteredFriends } =
    matchedPath === "all-friend"
      ? useSearch(listFriend)
      : matchedPath === "best-friend"
      ? useSearch(listBestFriend)
      : matchedPath === "suggestion"
      ? useSearch(listSuggestedFriend)
      : useSearch(listFriend);

  return (
    <div className="flex flex-col w-full h-full px-4 pt-4 pb-3 md:p-0 overflow-scroll scrollable">
      <div className="flex md:hidden w-full h-fit">
        <LeftComponent />
      </div>
      <div className="flex flex-col w-full h-full px-4 pt-4 pb-3 gap-6 overflow-scroll scrollable">
        <div className="flex flex-row w-full h-fit items-start justify-between">
          <div className="flex flex-row w-fit h-fit gap-2 items-end justify-start">
            <p className="text-dark100_light900 h3-medium">{label}</p>
            <p className="text-dark100_light900 h3-regular">({quantity})</p>
          </div>

          <div className="flex sm:w-fit w-[50%] h-fit justify-center items-center">
            <LocalSearch
              otherClasses="bg-light-800 dark:bg-dark-200 dark:bg-opacity-20 bg-opacity-50 w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {(matchedPath === "best-friend" || matchedPath === "all-friend") && (
          <div className="flex md:flex-row flex-col md:justify-between justify-start items-center md:flex-wrap md:gap-3 gap-1 overflow-scroll scrollable">
            {filteredFriends
              .filter((fr) => fr._id !== isIndex)
              .map((item) => (
                <div
                  className="flex md:flex-row lg:w-[48.6%] xl:w-[49%] w-full h-fit"
                  key={item._id}
                >
                  <FriendBox friend={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}

        {/* {matchedPath === "invitation" && (
          <div className="flex flex-row xl:justify-start justify-between items-center flex-wrap gap-3 xl:gap-x-3 xl:gap-y-6 overflow-scroll scrollable h-fit">
            {filteredFriends
              .filter((fr) => fr.status === "invite" && fr.id !== isIndex)
              .map((item) => (
                <div className="flex flex-row w-fit h-fit" key={item.id}>
                  <VerticalBox invitation={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}

        {matchedPath === "suggestion" && (
          <div className="flex flex-row xl:justify-start justify-between items-center flex-wrap xl:gap-x-3 xl:gap-y-6 gap-3 overflow-scroll scrollable h-fit">
            {filteredFriends
              .filter((fr) => fr.status === "suggest" && fr.id !== isIndex)
              .map((item) => (
                <div className="flex flex-row w-fit h-fit" key={item.id}>
                  <VerticalBox invitation={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default RightComponent;
