"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LocalSearch from "@/components/shared/search/localSearchbar";
import { usePathname } from "next/navigation";
import { RadioGroup } from "@/components/ui/radio-group";
import MemberRadio from "./MemberRadio";
import useSearchMember from "@/hooks/use-search-member-group";
import { useChatContext } from "@/context/ChatContext";
import { MessageBoxInfo, UserInfoBox } from "@/lib/DTO/message";
import { changeGroupLeader } from "@/lib/services/message/group/changeLeader";
import ConfirmModal, {
  ConfirmModalProps
} from "@/components/friends/ConfirmModal";

interface ChangeLeaderProps {
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangeLeader = ({ setIsChange }: ChangeLeaderProps) => {
  const [boxId, setBoxId] = useState<string>("");
  const [detailByBox, setDetailByBox] = useState<MessageBoxInfo>();
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const { dataChat, memberList } = useChatContext();
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });
  //boxId
  useEffect(() => {
    // Lấy đường dẫn hiện tại từ URL
    const path = window.location.pathname;
    // Chia đường dẫn thành các phần và lấy phần cuối cùng (boxId)
    const parts = path.split("/");
    const id = parts.pop(); // Lấy phần cuối cùng của đường dẫn

    if (id) {
      setBoxId(id); // Set boxId là chuỗi
    }
  }, [boxId]);
  useEffect(() => {
    if (boxId !== "") {
      const detail = dataChat.find((box) => box.id === boxId);
      if (detail) {
        setDetailByBox(detail);
      }
    }
  }, [boxId, dataChat, setDetailByBox]);

  const { toast } = useToast();
  const handleBack = () => {
    setIsChange(false);
  };

  const { searchTerm, setSearchTerm, filteredMembers } =
    useSearchMember(memberList);

  const handleMemberSelect = (id: string) => {
    setSelectedMemberId(id);
    console.log("Selected Member ID:", id);
  };
  const handleChange = async () => {
    try {
      const response = await changeGroupLeader(boxId, selectedMemberId);
      if (response.success) {
        toast({
          title: "You changed leader of this group successfully!",
          className:
            "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center"
        });
        setIsChange(false);
      } else {
        toast({
          title: `Failed to change leader: ${response.message}`,
          className:
            "border-none rounded-lg bg-red-200 text-red-500 paragraph-regular items-center justify-center"
        });
      }
    } catch (error) {
      toast({
        title: `Error in add member`,
        description: error instanceof Error ? error.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };
  const handleConfirmChangeLeader = () => {
    const selectInfo = memberList.find((item) => item._id === selectedMemberId);
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: () => handleChange(),
      name: selectInfo
        ? selectInfo.firstName + " " + selectInfo.lastName
        : "this person",
      action: "give key of group for"
    });
  };
  return (
    <>
      <div className="modal-overlay">
        <div className="min-w-[376px] max-w-[376px] md:max-w-[400px] lg:w-[400px] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col">
          <div className="flex w-full justify-between px-4 pt-2 pb-4">
            <p className="text-dark100_light900 paragraph-semibold mt-2 ">
              Change leader of Group
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
            <RadioGroup
              onValueChange={(value) => console.log(value)}
              className="flex flex-col w-full h-fit justify-start items-start gap-4"
            >
              {filteredMembers
                .filter((mem) => mem._id !== detailByBox?.createBy)
                .map((item) => {
                  const member = {
                    id: item._id,
                    ava: item.avatar,
                    name: item.firstName + " " + item.lastName,
                    onSelect: handleMemberSelect
                  };
                  return <MemberRadio key={item._id} member={member} />;
                })}
            </RadioGroup>
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
                onClick={handleConfirmChangeLeader}
                disabled={!selectedMemberId}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default ChangeLeader;
