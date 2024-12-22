"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import LocalSearch from "../shared/search/localSearchbar";
import FriendBox from "./FriendBox";
import LeftComponent from "./LeftComponent";
import { useFriendContext } from "@/context/FriendContext";
import useSearchFriendByPhone from "@/hooks/use-search-friend-by-phone";
import { FindUserDTO, RequestedResponseDTO } from "@/lib/DTO/friend";
import VerticalRequestBox from "./VerticalRequestBox";
import VerticalSuggestBox from "./VerticalSuggestBox";

const RightComponent = () => {
  const {
    listFriend,
    listBestFriend,
    listSuggestedFriend,
    listRequestedFriend
  } = useFriendContext();

  const [isIndex, setIndex] = useState("");

  const pathname = usePathname();
  const getPathNameMatch = () => {
    const paths = ["all-friend", "best-friend", "suggestion", "request"];
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
      : "Requests";

  let quantity = 0;
  switch (matchedPath) {
    case "all-friend":
      quantity = listFriend.length;
      break;
    case "best-friend":
      quantity = listBestFriend.length;
      break;
    case "suggestion":
      quantity = listSuggestedFriend.length;
      break;
    default:
      quantity = listRequestedFriend.length;
      break;
  }

  const { searchTerm, setSearchTerm, filteredFriends } =
    matchedPath === "all-friend"
      ? useSearchFriendByPhone(listFriend)
      : matchedPath === "best-friend"
      ? useSearchFriendByPhone(listBestFriend)
      : matchedPath === "suggestion"
      ? useSearchFriendByPhone(listSuggestedFriend)
      : useSearchFriendByPhone(listRequestedFriend);

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
            {(filteredFriends as FindUserDTO[] | RequestedResponseDTO[])
              .filter(
                (fr) =>
                  (fr._id !== isIndex &&
                    listFriend.some((friend) => friend._id === fr._id)) ||
                  listBestFriend.some((friend) => friend._id === fr._id)
              )
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
        {(matchedPath === "best-friend" || matchedPath === "all-friend") && (
          <div className="flex flex-col md:justify-between justify-start items-center md:flex-wrap gap-3 overflow-scroll scrollable">
            {(filteredFriends as FindUserDTO[] | RequestedResponseDTO[])
              .filter(
                (fr) =>
                  fr._id !== isIndex &&
                  !listFriend.some((friend) => friend._id === fr._id) &&
                  !listRequestedFriend.some((friend) => friend._id === fr._id)
              )
              .map((item) => (
                <div
                  className="flex md:flex-row lg:w-[48.6%] xl:w-[49%] w-full h-fit"
                  key={item._id}
                >
                  <VerticalSuggestBox request={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}
        {(matchedPath === "best-friend" || matchedPath === "all-friend") && (
          <div className="flex flex-col md:justify-between justify-start items-center md:flex-wrap gap-3 overflow-scroll scrollable">
            {(filteredFriends as FindUserDTO[] | RequestedResponseDTO[])
              .filter(
                (fr) =>
                  listRequestedFriend.some((friend) => friend._id === fr._id) &&
                  fr._id !== isIndex &&
                  !listFriend.some((friend) => friend._id === fr._id) &&
                  !listRequestedFriend.some((friend) => friend._id === fr._id)
              )
              .map((item) => (
                <div
                  className="flex md:flex-row lg:w-[48.6%] xl:w-[49%] w-full h-fit"
                  key={item._id}
                >
                  <VerticalRequestBox request={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}

        {matchedPath === "request" && (
          <div className="flex flex-row xl:justify-start justify-between items-center flex-wrap gap-3 xl:gap-x-3 xl:gap-y-6 overflow-scroll scrollable h-fit">
            {(filteredFriends as FindUserDTO[] | RequestedResponseDTO[])
              .filter(
                (fr) =>
                  listRequestedFriend.some((friend) => friend._id === fr._id) &&
                  fr._id !== isIndex
              )
              .map((item) => (
                <div className="flex flex-row w-fit h-fit" key={item._id}>
                  <VerticalRequestBox request={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}
        {matchedPath === "request" && (
          <div className="flex flex-row xl:justify-start justify-between items-center flex-wrap gap-3 xl:gap-x-3 xl:gap-y-6 overflow-scroll scrollable h-fit">
            {(filteredFriends as FindUserDTO[])
              .filter(
                (fr) =>
                  fr._id !== isIndex &&
                  (listFriend.some((friend) => friend._id === fr._id) ||
                    listBestFriend.some((friend) => friend._id === fr._id))
              )
              .map((item) => (
                <div className="flex flex-row w-fit h-fit" key={item._id}>
                  <FriendBox friend={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}
        {matchedPath === "request" && (
          <div className="flex flex-row xl:justify-start justify-between items-center flex-wrap gap-3 xl:gap-x-3 xl:gap-y-6 overflow-scroll scrollable h-fit">
            {(filteredFriends as FindUserDTO[])
              .filter(
                (fr) =>
                  fr._id !== isIndex &&
                  !listFriend.some((friend) => friend._id === fr._id) &&
                  !listRequestedFriend.some((friend) => friend._id === fr._id)
              )
              .map((item) => (
                <div className="flex flex-row w-fit h-fit" key={item._id}>
                  <VerticalSuggestBox request={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}

        {matchedPath === "suggestion" && (
          <div className="flex flex-row xl:justify-start justify-between items-center flex-wrap xl:gap-x-3 xl:gap-y-6 gap-3 overflow-scroll scrollable h-fit">
            {(filteredFriends as FindUserDTO[] | RequestedResponseDTO[])
              .filter(
                (fr) =>
                  fr._id !== isIndex &&
                  !listFriend.some((friend) => friend._id === fr._id) &&
                  !listRequestedFriend.some((friend) => friend._id === fr._id)
              )
              .map((item) => (
                <div className="flex flex-row w-fit h-fit" key={item._id}>
                  <VerticalSuggestBox request={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}
        {matchedPath === "suggestion" && (
          <div className="flex flex-row xl:justify-start justify-between items-center flex-wrap xl:gap-x-3 xl:gap-y-6 gap-3 overflow-scroll scrollable h-fit">
            {(filteredFriends as FindUserDTO[] | RequestedResponseDTO[])
              .filter(
                (fr) =>
                  (fr._id !== isIndex &&
                    !listRequestedFriend.some(
                      (friend) => friend._id === fr._id
                    ) &&
                    listFriend.some((friend) => friend._id === fr._id)) ||
                  listBestFriend.some((friend) => friend._id === fr._id)
              )
              .map((item) => (
                <div className="flex flex-row w-fit h-fit" key={item._id}>
                  <FriendBox friend={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}
        {matchedPath === "suggestion" && (
          <div className="flex flex-row xl:justify-start justify-between items-center flex-wrap xl:gap-x-3 xl:gap-y-6 gap-3 overflow-scroll scrollable h-fit">
            {(filteredFriends as FindUserDTO[] | RequestedResponseDTO[])
              .filter(
                (fr) =>
                  fr._id !== isIndex &&
                  listRequestedFriend.some((friend) => friend._id === fr._id)
              )
              .map((item) => (
                <div className="flex flex-row w-fit h-fit" key={item._id}>
                  <VerticalRequestBox request={item} setIndex={setIndex} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightComponent;
