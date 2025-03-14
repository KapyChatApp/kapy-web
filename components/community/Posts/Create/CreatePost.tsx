"use client";
import ConfirmModal, {
  ConfirmModalProps
} from "@/components/friends/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import UploadFiles from "./UploadFiles";
import { FileResponseDTO } from "@/lib/DTO/map";
import PreCreate from "./PreCreate";

const CreatePost = ({
  setIsCreate
}: {
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [step, setStep] = useState(0); // 0: UploadFiles, 1: PreCreate
  const [isMounted, setIsMounted] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [files, setFiles] = useState<FileResponseDTO[]>([]);
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

        <div
          className={`w-full h-[555px] rounded-lg background-light900_dark200 flex flex-col items-center justify-between ${
            step === 0 ? "max-w-[512px]" : "max-w-[852px]"
          }`}
        >
          {/* Header */}
          <div
            className={`flex w-full h-[43px] items-center ${
              step === 0
                ? files.length === 0
                  ? "justify-center"
                  : "justify-between"
                : "justify-between "
            } border-b border-light500_dark400 px-4`}
          >
            {step === 1 ? (
              // Nút Back khi ở bước PreCreate
              <button
                className="p-0 border-none shadow-none cursor-pointer"
                onClick={() => setStep(0)}
              >
                <Icon
                  icon="material-symbols:arrow-back-rounded"
                  width={16}
                  height={16}
                  className="text-dark100_light900 object-cover"
                />
              </button>
            ) : (
              <div></div>
            )}

            <h2 className="paragraph-bold text-dark100_light900">
              {step === 1 ? "Create new post" : "Upload files"}
            </h2>

            {step === 0 ? (
              // Nút Next khi ở bước UploadFiles
              files.length > 0 && (
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center bg-transparent text-primary-500 rounded-full body-semibold"
                >
                  Next
                </button>
              )
            ) : (
              // Nút Share khi ở bước PreCreate
              <button className="flex items-center justify-center bg-transparent text-primary-500 rounded-full body-semibold">
                Share
              </button>
            )}
          </div>

          {/* Nội dung */}
          {step === 0 ? (
            <UploadFiles files={files} setFiles={setFiles} />
          ) : (
            <PreCreate files={files} />
          )}
        </div>
      </div>

      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  ) : null;
};

export default CreatePost;
