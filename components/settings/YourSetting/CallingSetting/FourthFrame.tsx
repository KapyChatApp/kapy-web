import React from "react";
import SelectionSetting from "../sharedSetting/SelectionSetting";
import { selectionCamera } from "@/constants/settings";

interface FourthFrameProps {
  isSelectedCamera: string;
  setSelectedCamera: React.Dispatch<React.SetStateAction<string>>;
}

const FourthFrame = ({
  isSelectedCamera,
  setSelectedCamera
}: FourthFrameProps) => {
  return (
    <div className="flex flex-col background-light900_dark400 items-start justify-start py-3 px-4 rounded-lg w-full h-fit gap-3">
      <p className="text-dark100_light900 paragraph-medium">Camera</p>

      <div className="flex w-full h-fit">
        <SelectionSetting
          setSelected={setSelectedCamera}
          isSelected={isSelectedCamera}
          selectionData={selectionCamera}
        />
      </div>
    </div>
  );
};

export default FourthFrame;
