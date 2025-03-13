"use client";
import ConfirmModal, {
  ConfirmModalProps
} from "@/components/friends/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const CreatePost = ({
  setIsCreate
}: {
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });
  const handleBack = () => {
    setIsCreate(false);
  };
  const handleConfirmBack = () => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: handleBack,
      name: "post",
      action: "discard"
    });
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted ? (
    <>
      <div className="modal-overlay-post">
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <Button
            className="flex bg-transparent shadow-none p-2 border-none hover:bg-transparent h-10 w-10"
            onClick={handleConfirmBack}
          >
            <Icon
              icon="mingcute:close-fill"
              width={40}
              height={40}
              className="text-light-700"
            />
          </Button>
        </div>

        <div className="w-full max-w-[512px] h-[564px] rounded-lg background-light900_dark200 flex items-center justify-start">
          Create
        </div>
      </div>

      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  ) : null;
};

export default CreatePost;
