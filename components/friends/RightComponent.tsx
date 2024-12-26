"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import LocalSearch from "../shared/search/localSearchbar";
import FriendBox from "./FriendBox";
import LeftComponent from "./LeftComponent";
import { useFriendContext } from "@/context/FriendContext";
import useSearchFriendByPhone from "@/hooks/use-search-friend-by-phone";
import {
  FindUserDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";
import VerticalRequestBox from "./VerticalRequestBox";
import VerticalSuggestBox from "./VerticalSuggestBox";

// stranger
//block
// friend
// bff
// sent_bff
// received_bff
// sent_friend
// received_friend

const RightComponent = () => {
  const {
    listFriend,
    listBestFriend,
    listSuggestedFriend,
    listRequestedFriend
  } = useFriendContext();

  const [isIndex, setIndex] = useState("");
  const [isSearching, setIsSearching] = useState(false);
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

  useEffect(() => {
    setIsSearching(!!searchTerm.trim());
  }, [searchTerm]);

  const renderCoveredDiv = () => {
    let render = "";
    matchedPath === "all-friend" || matchedPath === "best-friend"
      ? (render =
          "flex md:flex-row flex-col md:justify-between justify-start items-center md:flex-wrap md:gap-3 gap-1 overflow-scroll scrollable")
      : matchedPath === "suggestion"
      ? (render =
          "flex flex-row xl:justify-start justify-between items-center flex-wrap xl:gap-x-3 xl:gap-y-6 gap-3 overflow-scroll scrollable h-fit")
      : (render =
          "flex flex-row xl:justify-start justify-between items-center flex-wrap gap-3 xl:gap-x-3 xl:gap-y-6 overflow-scroll scrollable h-fit");
    return render;
  };

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
        {!isSearching && (
          <>
            {(matchedPath === "best-friend" ||
              matchedPath === "all-friend") && (
              <div className="flex md:flex-row flex-col md:justify-between justify-start items-center md:flex-wrap md:gap-3 gap-1 overflow-scroll scrollable">
                {filteredFriends
                  .filter(
                    (fr) =>
                      fr._id !== isIndex &&
                      (listFriend.some((friend) => friend._id === fr._id) ||
                        listBestFriend.some((friend) => friend._id === fr._id))
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
            {matchedPath === "request" && (
              <div className="flex flex-row xl:justify-start justify-between items-center flex-wrap gap-3 xl:gap-x-3 xl:gap-y-6 overflow-scroll scrollable h-fit">
                {(filteredFriends as RequestedResponseDTO[])
                  .filter(
                    (fr) =>
                      fr._id !== isIndex &&
                      listRequestedFriend.some(
                        (friend) => friend._id === fr._id
                      )
                  )
                  .map((item) => (
                    <div className="flex flex-row w-fit h-fit" key={item._id}>
                      <VerticalRequestBox request={item} setIndex={setIndex} />
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
                      !listBestFriend.some((friend) => friend._id === fr._id) &&
                      !listRequestedFriend.some(
                        (friend) => friend._id === fr._id
                      )
                  )
                  .map((item) => (
                    <div className="flex flex-row w-fit h-fit" key={item._id}>
                      <VerticalSuggestBox request={item} setIndex={setIndex} />
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {isSearching && (
          <div className={`${renderCoveredDiv}`}>
            {filteredFriends.map((item) => {
              // Kiểm tra xem có `relation` hay không
              if ("relation" in item) {
                const { relation } = item;

                if (["friend", "bff", "sent_bff"].includes(relation)) {
                  return (
                    <div
                      className="flex md:flex-row lg:w-[48.6%] xl:w-[49%] w-full h-fit"
                      key={item._id}
                    >
                      <FriendBox
                        friend={item as FriendResponseDTO}
                        setIndex={setIndex}
                      />
                    </div>
                  );
                }
                if (["stranger"].includes(relation)) {
                  return (
                    <div
                      className="flex md:flex-row lg:w-[48.6%] xl:w-[49%] w-full h-fit"
                      key={item._id}
                    >
                      <VerticalSuggestBox
                        request={item as FindUserDTO}
                        setIndex={setIndex}
                      />
                    </div>
                  );
                }
                if (
                  [
                    "received_friend",
                    "received_bff",
                    "sent_bff",
                    "sent_friend"
                  ].includes(relation)
                ) {
                  return (
                    <div
                      className="flex md:flex-row lg:w-[48.6%] xl:w-[49%] w-full h-fit"
                      key={item._id}
                    >
                      <VerticalRequestBox
                        request={item as RequestedResponseDTO}
                        setIndex={setIndex}
                      />
                    </div>
                  );
                }
              }

              // Trường hợp không có `relation`
              return (
                <div
                  className="flex md:flex-row lg:w-[48.6%] xl:w-[49%] w-full h-fit"
                  key={item._id}
                >
                  <FriendBox
                    friend={item as FriendResponseDTO}
                    setIndex={setIndex}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightComponent;
