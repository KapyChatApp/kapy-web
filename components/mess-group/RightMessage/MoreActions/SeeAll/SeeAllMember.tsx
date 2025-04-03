"use client";
import ConfirmModal, {
  ConfirmModalProps
} from "@/components/friends/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { UserInfoBox } from "@/lib/DTO/message";
import { removeMemberFromGroup } from "@/lib/services/message/group/removeMember";
import { isOnline } from "@/lib/services/user/isOnline";
import { ActiveComponentProps, SeeAllProps } from "@/types/mess-group";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const SeeAllMember: React.FC<SeeAllProps> = ({
  setActiveComponent,
  detailByBox
}) => {
  const { memberList, setMemberList } = useChatContext();
  const { isOnlineChat } = useUserContext();
  const [adminId, setAdminId] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });
  const handleBack = () => {
    setActiveComponent("");
  };

  useEffect(() => {
    const id = localStorage.getItem("adminId");
    if (id) setAdminId(id);
  });

  const handleDeleteMember = async (target: UserInfoBox) => {
    try {
      const result = await removeMemberFromGroup(detailByBox.id, target._id);
      if (result.success) {
        toast({
          title: `You removed ${
            target.firstName + " " + target.lastName
          } successfully!`,
          className:
            "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
        });
        setMemberList((prevMemberList) =>
          prevMemberList.filter((member) => member._id !== target._id)
        );
        setActiveComponent("member");
      } else {
        toast({
          title: "Failed to remove member.",
          description: result.message,
          className:
            "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
        });
      }
    } catch (error) {
      toast({
        title: `Error in remove member`,
        description: error instanceof Error ? error.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };
  const handleConfirmDeleteMember = (target: UserInfoBox) => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: () => handleDeleteMember(target),
      name: target.firstName + " " + target.lastName,
      action: "delete"
    });
  };
  return (
    <>
      <div className="flex flex-col items-center justify-start w-full h-fit gap-6">
        <div className="flex w-full bg-light-700 dark:bg-dark-400 dark:bg-opacity-80 rounded-[12px] justify-center items-center h-[80px]">
          <Button
            className="flex flex-row shadow-none border-none bg-transparent w-full items-center justify-start gap-3 py-[28px] h-auto"
            onClick={handleBack}
          >
            <Icon
              icon="formkit:arrowleft"
              width={28}
              height={28}
              className="text-dark100_light900"
            />
            <div className="flex justify-center items-end w-full">
              <p className="paragraph-semibold text-dark100_light900">
                Members of Group
              </p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 paragraph-regular ml-1">
                ({memberList.length})
              </p>
            </div>
          </Button>
        </div>
        <div className="flex flex-col items-center w-full gap-4 px-2">
          {memberList.length > 0
            ? memberList.map((item) => (
                <div className="flex w-full h-full flex-row justify-between items-center">
                  <div
                    className="flex flex-row items-center justify-start w-fit gap-[12px] h-full"
                    key={item._id}
                  >
                    <div className="relative flex-shrink-0 w-fit">
                      <Image
                        src={
                          item.avatar ? item.avatar : "/assets/ava/default.png"
                        }
                        alt="ava"
                        width={42}
                        height={42}
                        className="rounded-full"
                      />
                      {isOnlineChat[item._id] && (
                        <div className="bg-green-600 rounded-full w-[10px] h-[8px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
                      )}
                    </div>

                    <div className="flex flex-col bg-transparent items-start h-full justify-center gap-[2px] flex-grow overflow-hidden min-w-0">
                      <p className="paragraph-regular text-dark100_light900 h-fit">
                        {item.firstName + " " + item.lastName}
                      </p>
                      <p className="small-regular text-dark100_light900 h-fit">
                        {detailByBox.createBy === item._id ? "Leader" : ""}
                      </p>
                    </div>
                  </div>

                  {detailByBox.createBy === adminId &&
                    item._id !== detailByBox.createBy && (
                      <div
                        className="flex w-fit h-fit items-center justify-center"
                        onClick={() => handleConfirmDeleteMember(item)}
                      >
                        <Icon
                          icon="iconamoon:trash-fill"
                          width={20}
                          height={20}
                          className="text-accent-red cursor-pointer"
                        />
                      </div>
                    )}
                </div>
              ))
            : null}
        </div>
      </div>

      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default SeeAllMember;
