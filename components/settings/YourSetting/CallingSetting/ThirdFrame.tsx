import React from "react";
import SelectionSetting from "../sharedSetting/SelectionSetting";
import { selectionSpeaker } from "@/constants/settings";

interface ThirdFrameProps {
  isSelectedSpeaker: string;
  setSelectedSpeaker: React.Dispatch<React.SetStateAction<string>>;
}

const ThirdFrame = ({
  isSelectedSpeaker,
  setSelectedSpeaker
}: ThirdFrameProps) => {
  return (
    <div className="flex flex-col background-light900_dark400 items-start justify-start py-3 px-4 rounded-lg w-full h-fit gap-3">
      <p className="text-dark100_light900 paragraph-medium">
        Speaker/Headphone
      </p>

      <div className="flex w-full h-fit">
        <SelectionSetting
          setSelected={setSelectedSpeaker}
          isSelected={isSelectedSpeaker}
          selectionData={selectionSpeaker}
        />
      </div>
    </div>
  );
};

export default ThirdFrame;
