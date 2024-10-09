import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import LeftSidbarSetting from "./sharedSetting/LeftSidbarSetting";
import GeneralSetting from "./GeneralSetting/GeneralSetting";
import AccountSecurity from "./AccountSecurity/AccountSecurity";
import PrivacySetting from "./PrivacySetting/PrivacySetting";
import CallingSetting from "./CallingSetting/CallingSetting";

interface SettingProps {
  setSetting: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingLayout = ({ setSetting }: SettingProps) => {
  const handleBack = () => {
    setSetting(false);
  };
  const [renderRight, setRenderRight] = useState("general");
  const handleRender = () => {
    switch (renderRight) {
      case "general":
        return (
          <GeneralSetting
            setRenderRight={setRenderRight}
            renderRight={renderRight}
          />
        );
      case "account-security":
        return (
          <AccountSecurity
            setRenderRight={setRenderRight}
            renderRight={renderRight}
          />
        );
      case "privacy":
        return (
          <PrivacySetting
            setRenderRight={setRenderRight}
            renderRight={renderRight}
          />
        );
      case "call":
        return (
          <CallingSetting
            setRenderRight={setRenderRight}
            renderRight={renderRight}
          />
        );
      default:
        return (
          <GeneralSetting
            setRenderRight={setRenderRight}
            renderRight={renderRight}
          />
        );
    }
  };
  return (
    <div className="modal-overlay">
      <div className="w-[52%] h-[612px] rounded-lg background-light850_dark200 items-center flex flex-row gap-2">
        <LeftSidbarSetting
          setRenderRight={setRenderRight}
          renderRight={renderRight}
        />

        <div className="flex flex-col w-full h-full gap-[10px] py-4">
          <div
            className="flex justify-end h-fit w-full items-center pr-4 cursor-pointer"
            onClick={handleBack}
          >
            <Icon
              icon="hugeicons:cancel-01"
              width={24}
              height={24}
              className="text-dark100_light900"
            />
          </div>

          <div className="flex items-start justify-center w-full h-full px-2">
            {handleRender()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingLayout;
