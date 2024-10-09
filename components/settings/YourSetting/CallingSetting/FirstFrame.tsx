import { Switch } from "@/components/ui/switch";
import React from "react";

const FirstFrame = () => {
  return (
    <div className="flex flex-col background-light900_dark400 items-start justify-start py-3 px-4 rounded-lg w-full h-fit gap-3">
      <p className="text-dark100_light900 paragraph-medium">Notification</p>
      <div className="flex flex-row items-center justify-between w-full h-fit pl-2">
        <p className="text-dark100_light900 body-regular text-opacity-80">
          Incoming call notification
        </p>

        <Switch />
      </div>
    </div>
  );
};

export default FirstFrame;
