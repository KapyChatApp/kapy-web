import React from "react";
import SelectionSetting from "../sharedSetting/SelectionSetting";
import { selectionObject } from "@/constants/settings";
interface SencondFrameProps {
  setSelectedMessage: React.Dispatch<React.SetStateAction<string>>;
  isSelectedMessage: string;
  setSelectedCalling: React.Dispatch<React.SetStateAction<string>>;
  isSelectedCalling: string;
}
const SecondFrame = ({
  isSelectedMessage,
  setSelectedMessage,
  isSelectedCalling,
  setSelectedCalling
}: SencondFrameProps) => {
  return (
    <div className="flex flex-col background-light900_dark400 items-start justify-start py-3 px-4 rounded-lg w-full h-fit gap-3">
      <p className="text-dark100_light900 paragraph-medium">
        Messages and Calls
      </p>
      <div className="flex flex-row justify-between items-center w-full h-fit pl-2">
        <p className="text-dark100_light900 text-opacity-80 body-regular">
          Allow messaging
        </p>
        <div className="flex w-fit h-fit">
          <SelectionSetting
            setSelected={setSelectedMessage}
            isSelected={isSelectedMessage}
            selectionData={selectionObject}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center w-full h-fit pl-2">
        <p className="text-dark100_light900 text-opacity-80 body-regular">
          Allow calling
        </p>
        <div className="flex w-fit h-fit">
          <SelectionSetting
            setSelected={setSelectedCalling}
            isSelected={isSelectedCalling}
            selectionData={selectionObject}
          />
        </div>
      </div>
    </div>
  );
};

export default SecondFrame;
