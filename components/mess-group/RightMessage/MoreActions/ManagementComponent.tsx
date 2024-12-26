"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ActiveComponentProps } from "@/types/mess-group";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { use, useEffect, useState } from "react";
import ChangeLeader from "./ChangeLeader";
import ModalConfirm from "./ModalConfirm";
import { Switch } from "@/components/ui/switch";
import { MessageBoxInfo } from "@/lib/DTO/message";
import ConfirmModal, {
  ConfirmModalProps
} from "@/components/friends/ConfirmModal";
import { disbandGroup } from "@/lib/services/message/group/disband";
import { toast } from "@/hooks/use-toast";

interface props {
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
  box: MessageBoxInfo;
}

export interface ManagementGroup {
  id: string;
  label: string;
}
const manage: ManagementGroup[] = [
  {
    id: "Change",
    label: "Change avatar and name of group"
  },
  {
    id: "send",
    label: "Send message"
  },
  {
    id: "add",
    label: "Add members"
  }
];
const ManagementComponent: React.FC<props> = ({ setActiveComponent, box }) => {
  const [adminId, setAdminId] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });
  const [isChange, setIsChange] = useState(false);
  const handleChange = () => {
    setIsChange(!isChange);
  };
  const handleBack = () => {
    setActiveComponent("");
  };

  const handleDisband = async () => {
    try {
      const result = await disbandGroup(box.id);
      if (result.success) {
        toast({
          title: "Group has been disbanded successfully!",
          className:
            "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center"
        });
      } else {
        toast({
          title: "Failed to disband group.",
          description: result.message || "Something went wrong.",
          className:
            "border-none rounded-lg bg-red-200 text-red-500 paragraph-regular items-center justify-center"
        });
      }
    } catch (error) {
      toast({
        title: "Error occurred while disbanding group.",
        description: error instanceof Error ? error.message : "Unknown error",
        className:
          "border-none rounded-lg bg-red-200 text-red-500 paragraph-regular items-center justify-center"
      });
    }
  };
  const handleConfirmDisband = () => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: () => handleDisband(),
      name: box.groupName,
      action: "disband"
    });
  };

  useEffect(() => {
    const id = localStorage.getItem("adminId");
    if (id) setAdminId(id);
  });
  return (
    <>
      <div className="flex flex-col w-full h-full items-center justify-start">
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
            <div className="flex justify-center items-center w-full">
              <p className="paragraph-semibold text-dark100_light900">
                Management of Group
              </p>
            </div>
          </Button>
        </div>

        <div className="flex flex-col mt-8 w-full items-center justify-start gap-8 px-[8px]">
          <div className="flex flex-col w-full items-start justify-center gap-[12px]">
            <p className="body-semibold text-dark100_light900">
              Allow all members to:
            </p>
            <div className="flex flex-col w-full items-start justify-center gap-[12px]">
              {manage.map((item) => (
                <div className="flex items-center justify-between w-full">
                  <label
                    htmlFor="terms2"
                    className="body-regular leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-dark100_light900"
                  >
                    {item.label}
                  </label>
                  <Checkbox
                    id="terms2"
                    className={`data-[state=checked]:bg-primary-500 data-[state=checked]:text-light-900 disabled:opacity-1 h-[18px] w-[18px] border-none bg-light-500 dark:bg-dark-400 dark:bg-opacity-80 dark:data-[state=checked]:bg-primary-500 dark:data-[state=checked]:text-light-900`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between w-full ">
            <p className="body-semibold text-dark100_light900">
              Allow all members to:
            </p>
            <Switch id="block-mode" />
          </div>

          {box.createBy === adminId && (
            <div className="flex w-full bg-light-700 dark:bg-dark-400 dark:bg-opacity-80 rounded-lg justify-center items-center">
              <Button
                className="flex flex-row shadow-none border-none bg-transparent w-full h-auto px-3"
                onClick={handleChange}
              >
                <div className="flex w-full h-full items-center justify-center xl:gap-4 sm:gap-2 gap-3">
                  <p className="body-semibold text-dark100_light900 mb-[2px]">
                    Change the leader of group
                  </p>
                  <Icon
                    icon="ooui:next-ltr"
                    width={12}
                    height={18}
                    className="text-dark100_light900"
                  />
                </div>
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-grow mt-auto w-full items-end justify-end">
          <Button
            className="flex flex-row shadow-none border-none bg-transparent w-full items-center justify-center py-[8px] bg-accent-red bg-opacity-20 rounded-lg hover:bg-accent-red hover:bg-opacity-20 "
            onClick={handleConfirmDisband}
          >
            <p className="paragraph-semibold text-accent-red">
              Disband this group
            </p>
          </Button>
        </div>

        {isChange && <ChangeLeader setIsChange={setIsChange} />}
      </div>
      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default ManagementComponent;
