"use client";
import { User } from "@/types/object";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import LocalSearch from "../shared/search/localSearchbar";
import VerticalBox from "./VerticalBox";
import FriendBox from "./FriendBox";
import useSearch from "@/hooks/use-search";

interface RightComponentProps {
  friendList: User[];
}

const RightComponent: React.FC<RightComponentProps> = ({ friendList }) => {
  const friend = friendList;
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

  const quantity =
    matchedPath === "all-friend" || matchedPath === "best-friend"
      ? friend.filter((fr) => fr.status === "" || fr.status === "best").length
      : matchedPath === "suggestion"
      ? friend.filter((fr) => fr.status === "suggest").length
      : matchedPath === "invitation"
      ? friend.filter((fr) => fr.status === "invite").length
      : 0;

  const { searchTerm, setSearchTerm, filteredFriends } = useSearch(friendList);

  return (
    <div className="flex flex-col w-full h-full px-4 pt-4 pb-3 gap-6 overflow-scroll scrollable">
      <div className="flex flex-row w-full h-fit items-start justify-between">
        <div className="flex flex-row w-fit h-fit gap-2 items-end justify-start">
          <p className="text-dark100_light900 h3-medium">{label}</p>
          <p className="text-dark100_light900 h3-regular">({quantity})</p>
        </div>

        <div className="flex w-fit h-fit justify-center items-center">
          <LocalSearch
            otherClasses="bg-light-800 dark:bg-dark-200 dark:bg-opacity-20 bg-opacity-50 w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {(matchedPath === "best-friend" || matchedPath === "all-friend") && (
        <div className="flex md:flex-row flex-col justify-between items-center flex-wrap gap-3 overflow-scroll scrollable">
          {filteredFriends
            .filter(
              (fr) =>
                (fr.status === "" || fr.status === "best") && fr.id !== isIndex
            )
            .map((item) => (
              <div
                className="flex lg:flex-row lg:w-[49%] w-full h-fit"
                key={item.id}
              >
                <FriendBox friend={item} setIndex={setIndex} />
              </div>
            ))}
        </div>
      )}

      {matchedPath === "invitation" && (
        <div className="flex md:flex-row flex-col justify-start items-center flex-wrap gap-3 overflow-scroll scrollable h-fit">
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
        <div className="flex md:flex-row flex-col justify-start items-center flex-wrap gap-3 overflow-scroll scrollable h-fit">
          {filteredFriends
            .filter((fr) => fr.status === "suggest" && fr.id !== isIndex)
            .map((item) => (
              <div className="flex flex-row w-fit h-fit" key={item.id}>
                <VerticalBox invitation={item} setIndex={setIndex} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RightComponent;
