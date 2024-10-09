import React from "react";
import SelectionSetting from "../sharedSetting/SelectionSetting";
import { selectionMicro } from "@/constants/settings";

interface SencondFrameProps {
  isSelectedMicro: string;
  setSelectedMicro: React.Dispatch<React.SetStateAction<string>>;
}

const SecondFrame = ({
  isSelectedMicro,
  setSelectedMicro
}: SencondFrameProps) => {
  return (
    <div className="flex flex-col background-light900_dark400 items-start justify-start py-3 px-4 rounded-lg w-full h-fit gap-3">
      <p className="text-dark100_light900 paragraph-medium">Microphone</p>

      <div className="flex w-full h-fit">
        <SelectionSetting
          setSelected={setSelectedMicro}
          isSelected={isSelectedMicro}
          selectionData={selectionMicro}
        />
      </div>
    </div>
  );
};

export default SecondFrame;
