"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import ModalConfirm from "./ModalConfirm";
import { ActiveComponentProps } from "@/types/mess-group";

const MoreBottom: React.FC<ActiveComponentProps> = ({ setActiveComponent }) => {
  const [stButton, setFirst] = useState(false);
  const [ndButton, setSecond] = useState(false);

  const handleFirstButton = () => {
    setFirst(!stButton);
  };

  const handleSecondButton = () => {
    setSecond(!ndButton);
  };

  const pathname = usePathname();
  const isGroup = /^\/group-chat\/\d+$/.test(pathname);
  const displayLabelButton = isGroup ? "Leave Group" : "Unfriend";
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-[8px] w-full mt-auto responsive-moreAction">
        <div className="flex items-center justify-center gap-[8px] w-full rounded-lg bg-light-700 dark:bg-dark-400 dark:bg-opacity-80">
          <Button
            className="shadow-none border-none flex items-center justify-center w-full bg-transparent"
            onClick={handleFirstButton}
          >
            <p className="text-dark100_light900  paragraph-semibold">Remove</p>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-[8px] w-full rounded-lg bg-accent-red bg-opacity-20">
          <Button
            className="shadow-none border-none flex items-center justify-center w-full bg-transparent"
            onClick={handleSecondButton}
          >
            <p className="text-accent-red paragraph-semibold">
              {displayLabelButton}
            </p>
          </Button>
        </div>
      </div>

      {stButton && (
        <ModalConfirm
          setConfirm={setFirst}
          setActiveComponent={setActiveComponent}
          label="Are you sure to remove this chat?"
        />
      )}

      {ndButton && (
        <ModalConfirm
          setConfirm={setSecond}
          setActiveComponent={setActiveComponent}
          label={
            isGroup
              ? "Are you sure to leave this group chat?"
              : "Are you sure to unfriend?"
          }
        />
      )}
    </>
  );
};

export default MoreBottom;
