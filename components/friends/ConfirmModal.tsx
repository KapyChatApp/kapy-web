import React from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ConfirmModalProps } from "@/types/friends";

interface Confirm {
  confirm: ConfirmModalProps;
}

const ConfirmModal: React.FC<Confirm> = ({ confirm }) => {
  const { setConfirm, setIndex, listId, name, action } = confirm;
  const handleBack = () => {
    setConfirm(false);
  };
  const handleConfirm = () => {
    console.log("Handle successfully!");
    handleBack();
  };
  return (
    <div className="modal-overlay">
      <div className="w-[26%] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col">
        <div className="flex w-full justify-end items-center px-4 pt-2">
          <Icon
            icon="iconoir:cancel"
            width={18}
            height={18}
            className="text-dark100_light900 cursor-pointer"
            onClick={handleBack}
          />
        </div>
        <div className="flex w-full items-center justify-center mt-7">
          <p className="paragraph-regular text-dark100_light900">
            Are you sure to {action} {name}
          </p>
        </div>
        <span className="flex w-full h-[0.5px] background-light500_dark400 mt-7 mb-2"></span>

        <div className="flex justify-end w-full items-center px-4 pb-2">
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

export default ConfirmModal;
