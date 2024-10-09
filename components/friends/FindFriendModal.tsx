import React, { useState } from "react";
import { Button } from "../ui/button";
import LocalSearch from "../shared/search/localSearchbar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { historyFindFriend } from "@/constants/friends";
import FindFriendItems from "./FindFriendItems";
import useSearch from "@/hooks/use-search";

interface FindFriendProps {
  setFind: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindFriendModal = ({ setFind }: FindFriendProps) => {
  const handleBack = () => {
    setFind(false);
  };
  const { searchTerm, setSearchTerm, filteredFriends } =
    useSearch(historyFindFriend);

  const handleFind = () => {};

  return (
    <div className="modal-overlay">
      <div className="w-[26%] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col">
        <div className="flex w-full justify-between px-4 pt-2 pb-4">
          <p className="text-dark100_light900 paragraph-semibold mt-2">
            Add new friends
          </p>
          <Button
            className="flex bg-transparent shadow-none p-0 border-none hover:bg-transparent w-fit h-full"
            onClick={handleBack}
          >
            <Icon
              icon="iconoir:cancel"
              width={18}
              height={18}
              className="text-dark100_light900"
            />
          </Button>
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex flex-col w-full px-4 pt-3">
          <LocalSearch
            otherClasses="border-none bg-light-800 dark:bg-dark-400 bg-opacity-50 dark:bg-opacity-50"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <span className="flex w-full h-[0.5px] background-light500_dark400 mt-3"></span>
        </div>

        <div className="flex h-[307px] w-full overflow-scroll scrollable py-2">
          <div className="flex flex-col w-full h-fit justify-start items-start ">
            {filteredFriends.map((item) => {
              return <FindFriendItems user={item} />;
            })}
          </div>
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex justify-end w-full items-center pr-4 py-2">
          <div className="flex flex-row w-full h-fit gap-6 justify-end">
            <Button
              onClick={handleBack}
              className="paragraph-regular text-dark100_light900 py-2 px-3 rounded-lg background-light700_dark400 w-fit"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary-500 hover:bg-primary-500 hover:bg-opacity-20 bg-opacity-20 text-primary-500 paragraph-regular py-2 px-3 rounded-lg w-fit"
              onClick={handleFind}
            >
              Find
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindFriendModal;
