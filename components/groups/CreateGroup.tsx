import React from "react";
import { Button } from "../ui/button";
import UserCheckbox from "../mess-group/MoreActions/UserCheckbox";
import LocalSearch from "../shared/search/localSearchbar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useToast } from "@/hooks/use-toast";
import { user } from "@/constants/object";
import { ActiveComponentProps } from "@/types/mess-group";
import { Input } from "../ui/input";

interface CreateGroupProps {
  setCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateGroup = ({ setCreated }: CreateGroupProps) => {
  const userList = user.map((item) => item);

  const { toast } = useToast();
  const handleBack = () => {
    setCreated(false);
  };
  const handleAdd = () => {
    toast({
      title: "You created group successfully!",
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
    setCreated(false);
  };
  return (
    <div className="modal-overlay">
      <div className="w-[26%] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col">
        <div className="flex w-full justify-between px-[10px] pt-[10px] pb-4">
          <p className="text-dark100_light900 paragraph-semibold mt-[6px] ml-[6px]">
            Create your group
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

        <div className="flex flex-row w-full px-4 mt-3 items-center justify-start gap-[10px] ">
          <Button className="flex h-full p-3 items-center justify-center border-none shadow-none background-light700_dark400 hover:background-light700_dark400 rounded-full">
            <Icon
              icon="solar:camera-bold"
              width={24}
              height={24}
              className="text-dark100_light900"
            />
          </Button>

          <div className="flex w-full h-fit p-1 border-b border-light500_dark400">
            <Input
              type="text"
              placeholder="Input the name of group"
              className="body-light dark:text-light-900 text-dark-100 placeholder:text-opacity-50 placeholder:dark:text-opacity-80 placeholder:dark:text-light-900 placeholder:text-dark-100 no-focus border-none shadow-none outline-none w-full h-full placeholder:body-light p-[0px] bg-transparent text-wrap"
            />
          </div>
        </div>

        <div className="flex flex-col w-full px-4 pt-3">
          <LocalSearch otherClasses="border-none bg-light-800 dark:bg-dark-400 bg-opacity-50 dark:bg-opacity-50" />

          <span className="flex w-full h-[0.5px] background-light500_dark400 mt-3"></span>
        </div>

        <div className="flex max-h-[307px] w-full overflow-scroll scrollable">
          <div className="flex flex-col w-full h-full justify-center items-start gap-4 py-2">
            {userList.map((item) => {
              const user = {
                id: item.id,
                ava: item.ava,
                name: item.name
              };
              return <UserCheckbox user={user} />;
            })}
          </div>
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex justify-end w-full items-center pr-2 py-2">
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
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
