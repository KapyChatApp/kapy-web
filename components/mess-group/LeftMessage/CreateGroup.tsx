"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import UserCheckbox from "../RightMessage/MoreActions/UserCheckbox";
import LocalSearch from "../../shared/search/localSearchbar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../../ui/input";
import { getMyListFriend } from "@/lib/data/mine/dataAllFriends";
import { useFriendContext } from "@/context/FriendContext";
import { RequestCreateGroup } from "@/lib/DTO/message";
import { createGroup } from "@/lib/services/message/createGroup";
import { useChatContext } from "@/context/ChatContext";
import PersonalUpdateAva from "@/components/settings/Profile/PersonalUpdateAva";
import AvatarEditor from "react-avatar-editor";
import UpdateGroupAva from "./UpdateGroupAva";
import Image from "next/image";

interface CreateGroupProps {
  setCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateGroup = ({ setCreated }: CreateGroupProps) => {
  const { setListFriend, listFriend } = useFriendContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupAva, setGroupAva] = useState<File>();
  const [groupAvaTemporary, setGroupAvaTemporary] = useState("");
  const [updateAva, setUpdateAva] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const editorRef = useRef<AvatarEditor | null>(null);
  const [error, setError] = useState("string");
  const { toast } = useToast();
  const { setDataChat } = useChatContext();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase()); // Chuyển về chữ thường để tìm kiếm không phân biệt chữ hoa/thường
  };
  const handleBack = () => {
    setCreated(false);
  };
  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setSelectedIds((prev) =>
      isChecked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };
  const handleGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setGroupName(newValue);
  };
  const handleUpdateAva = () => {
    setUpdateAva(true);
  };

  const handleAdd = async () => {
    if (selectedIds.length < 2) {
      toast({
        title: "Group is created at least 2 members.",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
      return;
    }
    const param: RequestCreateGroup = {
      membersIds: selectedIds,
      groupName: groupName
    };
    console.log(param);
    const result = await createGroup(param, groupAva, setDataChat, setError);
    const { success, newBox } = result;
    console.log(success);
    if (success) {
      toast({
        title: "You created group successfully!",
        className:
          "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
      });
      setGroupAva(undefined);
      setGroupName("");
      setCreated(false);
    } else {
      toast({
        title: "You can't create group.",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };

  useEffect(() => {
    // Gọi API lấy danh sách bạn bè khi component mount
    const fetchData = async () => {
      try {
        await getMyListFriend(setListFriend, setError);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchData();
  }, []);
  const filteredFriends = listFriend.filter((friend) =>
    `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchQuery)
  );
  return (
    <>
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
            <Button
              className={`flex h-full ${
                groupAva ? "p-0" : "p-3"
              } items-center justify-center border-none shadow-none background-light700_dark400 hover:background-light700_dark400 rounded-full`}
              onClick={handleUpdateAva}
            >
              {groupAvaTemporary ? (
                <Image
                  src={groupAvaTemporary}
                  alt="ava"
                  width={48}
                  height={48}
                  className="rounded-full"
                  objectFit="cover"
                />
              ) : (
                <Icon
                  icon="solar:camera-bold"
                  width={24}
                  height={24}
                  className="text-dark100_light900"
                />
              )}
            </Button>

            <div className="flex w-full h-fit p-1 border-b border-light500_dark400">
              <Input
                value={groupName}
                type="text"
                placeholder="Input the name of group"
                className="body-light dark:text-light-900 text-dark-100 placeholder:text-opacity-50 placeholder:dark:text-opacity-80 placeholder:dark:text-light-900 placeholder:text-dark-100 no-focus border-none shadow-none outline-none w-full h-full placeholder:body-light p-[0px] bg-transparent text-wrap"
                onChange={handleGroupName}
              />
            </div>
          </div>

          <div className="flex flex-col w-full px-4 pt-3">
            <LocalSearch
              otherClasses="border-none bg-light-800 dark:bg-dark-400 bg-opacity-50 dark:bg-opacity-50"
              onChange={handleSearchChange}
            />

            <span className="flex w-full h-[0.5px] background-light500_dark400 mt-3"></span>
          </div>

          <div className="flex max-h-[307px] w-full overflow-scroll scrollable">
            <div className="flex flex-col w-full h-full justify-center items-start gap-4 py-2">
              {filteredFriends.map((item) => {
                const user = {
                  id: item._id,
                  ava: item.avatar ? item.avatar : "/assets/ava/default.png",
                  name: item.firstName + " " + item.lastName,
                  onChange: handleCheckboxChange
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
      {updateAva && (
        <UpdateGroupAva
          setUpdateAva={setUpdateAva}
          setGroupAva={setGroupAva}
          editorRef={editorRef}
          setGroupAvaTemporary={setGroupAvaTemporary}
        />
      )}
    </>
  );
};

export default CreateGroup;
