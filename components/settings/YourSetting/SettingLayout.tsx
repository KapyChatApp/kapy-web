"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import LeftSidbarSetting from "./sharedSetting/LeftSidbarSetting";
import GeneralSetting from "./GeneralSetting/GeneralSetting";
import AccountSecurity from "./AccountSecurity/AccountSecurity";
import PrivacySetting from "./PrivacySetting/PrivacySetting";
import CallingSetting from "./CallingSetting/CallingSetting";
import AuthHistory from "./AuthHistory/AuthHistory";

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
      case "history":
        return <AuthHistory />;
      default:
        return (
          <GeneralSetting
            setRenderRight={setRenderRight}
            renderRight={renderRight}
          />
        );
    }
  };
  const left = {
    setRenderRight,
    renderRight
  };

  //RESPONSIVE FOR 630px
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(false);
  const handleResize = () => {
    if (window.innerWidth < 630) {
      setShowLeft(true);
    } else {
      setShowLeft(false);
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="modal-overlay">
      <div
        className={` ${
          showLeft
            ? "w-fit"
            : "w-[600px] max-w-[600px] md:max-w-[750px] lg:w-[750px] "
        } h-[612px] rounded-lg background-light850_dark200 items-center flex flex-row gap-2`}
      >
        {/*LeftSidebarSetting*/}
        <div
          className={` h-full items-start justify-start background-light900_dark400
          ${
            showLeft
              ? "flex flex-col w-[400px] rounded-lg py-4"
              : "w-[200px] max-w-[200px] md:max-w-[230px] lg:w-[230px] rounded-l-lg"
          }`}
        >
          {showLeft && (
            <div className="flex flex-row w-full justify-between items-cente px-4">
              {showRight ? (
                <div
                  className="flex h-fit w-fit items-center cursor-pointer"
                  onClick={() => setShowRight(false)}
                >
                  <Icon
                    icon="eva:arrow-back-fill"
                    width={30}
                    height={30}
                    className="text-primary-500"
                  />
                </div>
              ) : (
                <p className="text-dark100_light900 base-bold">Setting</p>
              )}
              <div
                className="flex justify-end h-fit w-full items-center cursor-pointer"
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
          )}
          <LeftSidbarSetting
            left={left}
            setShowRight={setShowRight}
            showRight={showRight}
            showLeft={showLeft}
            handleRender={handleRender}
          />
        </div>

        {/*RightRender*/}
        <div
          className={`w-[400px] max-w-[400px] md:max-w-[520px] lg:w-[520px] h-full items-start
          ${!showLeft ? "flex" : "hidden"} `}
        >
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
    </div>
  );
};

export default SettingLayout;
