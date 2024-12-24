"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ActiveComponentProps } from "@/types/mess-group";
import React, { useState } from "react";
import LocalSearch from "@/components/shared/search/localSearchbar";
import { Icon } from "@iconify/react/dist/iconify.js";
import UserCheckbox from "./UserCheckbox";
import useSearch from "@/hooks/use-search";
import { useFriendContext } from "@/context/FriendContext";
import useSearchFriendByPhone from "@/hooks/use-search-friend-by-phone";

const AddComponent: React.FC<ActiveComponentProps> = ({
  setActiveComponent
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { listFriend } = useFriendContext();
  const { toast } = useToast();
  const handleBack = () => {
    setActiveComponent("");
  };
  const handleAdd = () => {
    toast({
      title: "You added members successfully!",
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
    setActiveComponent("");
  };

  const { searchTerm, setSearchTerm, filteredFriends } =
    useSearchFriendByPhone(listFriend);

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setSelectedIds((prev) =>
      isChecked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  return (
    <div className="modal-overlay">
      <div className="min-w-[376px] max-w-[376px] md:max-w-[400px] lg:w-[400px] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col md:shadow-none shadow-sm drop-shadow-sm shadow-zinc-700">
        <div className="flex w-full justify-between px-4 pt-2 pb-4">
          <p className="text-dark100_light900 paragraph-semibold mt-2">
            Add members to this group
          </p>
          <Icon
            icon="iconoir:cancel"
            width={18}
            height={18}
            className="text-dark100_light900 cursor-pointer"
            onClick={handleBack}
          />
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
          <div className="flex flex-col w-full h-fit justify-start items-start gap-4 ">
            {filteredFriends.map((item) => {
              const user = {
                id: item._id,
                ava: item.avatar,
                name: item.firstName + " " + item.lastName,
                onChange: handleCheckboxChange
              };
              return <UserCheckbox user={user} />;
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
              onClick={handleAdd}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;
