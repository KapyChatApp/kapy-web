"use client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { disturbTime } from "@/constants/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
interface DisturbTimeProps {
  setDisturb: React.Dispatch<React.SetStateAction<boolean>>;
  setDisturbSwitchOff: React.Dispatch<React.SetStateAction<boolean>>;
}
const DisturbTime = ({ setDisturb, setDisturbSwitchOff }: DisturbTimeProps) => {
  const [selectedValue, setSelectedValue] = useState("");
  const handleValueChange = (value: any) => {
    if (selectedValue === value) {
      setSelectedValue("");
    } else {
      setSelectedValue(value);
    }
  };
  const handleBack = () => {
    setDisturb(false);
    setDisturbSwitchOff(true);
  };

  const handleDone = () => {
    setDisturb(false);
  };
  return (
    <div className="modal-overlay">
      <div className="w-[264px] rounded-lg background-light850_dark200 items-center flex flex-col gap-4 px-3 py-2">
        <div className="flex flex-row w-full h-fit items-center justify-between">
          <div className="flex items-center justify-center h-fit w-full">
            <p className="text-dark100_light900 paragraph-medium w-fit">
              Do not disturb
            </p>
          </div>
          <div
            className="flex justify-end h-fit items-center cursor-pointer"
            onClick={handleBack}
          >
            <Icon
              icon="hugeicons:cancel-01"
              width={24}
              height={24}
              className="text-dark100_light900"
            />
          </div>
        </div>

        <div className="flex flex-col py-2 justify-start items-start w-full h-fit gap-6">
          {disturbTime.map((item) => (
            <RadioGroup value={selectedValue} onValueChange={handleValueChange}>
              <div
                className="flex flex-row items-start justify-start w-full h-fit gap-3"
                onClick={() => handleValueChange(item.unit)}
                style={{ cursor: "pointer" }}
              >
                <div className="flex h-fit w-fit">
                  <RadioGroupItem
                    value={item.unit}
                    id={item.id}
                    checked={selectedValue === item.unit} // Kiểm tra nếu được chọn
                    onClick={() => handleValueChange(item.unit)}
                    className="data-[state=checked]:bg-primary-500 border-light-600 dark:border-dark-500 border text-light-900 data-[state=checked]:border-none h-5 w-5"
                  />
                </div>
                <p className="text-dark100_light900 body-regular">
                  {item.unit}
                </p>
              </div>
            </RadioGroup>
          ))}
        </div>

        <div className="flex flex-row items-center justify-center w-full gap-2">
          <Button
            className="flex border-none shadow-none py-3 w-[50%] text-dark100_light900 background-light700_dark400 rounded-lg hover:background-light700_dark400 "
            onClick={handleBack}
          >
            Cancel
          </Button>

          <Button
            className="flex border-none shadow-none py-3 w-[50%] bg-primary-500 text-light-900 rounded-lg hover:bg-primary-500"
            onClick={handleDone}
            disabled={selectedValue === ""}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DisturbTime;
