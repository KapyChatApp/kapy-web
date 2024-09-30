import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

interface ModalConfirmProps {
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}

const ModalConfirm = ({
  setActiveComponent,
  setConfirm,
  label
}: ModalConfirmProps) => {
  const handleBack = () => {
    setConfirm(false);
  };
  const handleConfirm = () => {
    setActiveComponent("");
    setConfirm(false);
  };
  return (
    <div className="modal-overlay">
      <div className="w-[26%] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col">
        <div className="flex w-full justify-end items-center pr-2 pt-2">
          <Icon
            icon="iconoir:cancel"
            width={18}
            height={18}
            className="text-dark100_light900 cursor-pointer"
            onClick={handleBack}
          />
        </div>
        <div className="flex w-full items-center justify-center mt-7">
          <p className="paragraph-regular text-dark100_light900">{label}</p>
        </div>
        <span className="flex w-full h-[0.5px] background-light500_dark400 mt-7 mb-2"></span>

        <div className="flex justify-end w-full items-center pr-2 pb-2">
          <div className="flex flex-row w-full h-fit gap-6 justify-end">
            <Button
              onClick={handleBack}
              className="paragraph-regular text-dark100_light900 py-2 px-3 rounded-lg background-light700_dark400 w-fit"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary-500 hover:bg-primary-500 hover:bg-opacity-20 bg-opacity-20 text-primary-500 paragraph-regular py-2 px-3 rounded-lg w-fit"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
