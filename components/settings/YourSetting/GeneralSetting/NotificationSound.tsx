"use client";
import React, { useState } from "react";
import SettingItem from "../sharedSetting/SettingItem";
import { settingItem } from "@/constants/settings";
import { Switch } from "@/components/ui/switch";
import DisturbTime from "./DisturbTime";

const NotificationSound = () => {
  const [isDisturbTime, setDisturbTime] = useState(false);
  const [isDisturbSwitchOff, setDisturbSwitchOff] = useState(true);
  const handleSwitchChange = (id: string, value: boolean) => {
    if (id === "Do not disturb") {
      setDisturbTime(value);
      setDisturbSwitchOff(!value);
    }
  };
  return (
    <>
      <div className="flex flex-col background-light900_dark400 items-start justify-start py-3 px-4 rounded-lg w-full h-fit gap-4">
        <p className="text-dark100_light900 paragraph-medium">Notification</p>
        <div className="flex flex-col pl-2 gap-4 w-full h-fit">
          {settingItem.map((item) => {
            const general = {
              icon: item.icon,
              title: item.title,
              description: item.description
            };
            return (
              <div className="flex flex-row items-start justify-between w-full h-fit">
                <SettingItem general={general} />
                <div className="flex h-fit w-fit">
                  <Switch
                    id={item.title}
                    checked={
                      item.title === "Do not disturb"
                        ? !isDisturbSwitchOff
                        : undefined
                    }
                    onCheckedChange={(value) =>
                      handleSwitchChange(item.title, value)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isDisturbTime && (
        <DisturbTime
          setDisturb={setDisturbTime}
          setDisturbSwitchOff={setDisturbSwitchOff}
        />
      )}
    </>
  );
};

export default NotificationSound;
