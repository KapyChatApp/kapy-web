"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React from "react";

const MoreBottom = () => {
  const pathname = usePathname();
  const isGroup = /^\/groups\/\d+$/.test(pathname);
  const displayLabel = isGroup ? "Leave Group" : "Unfriend";
  return (
    <div className="flex flex-col items-center justify-center gap-[8px] w-full mt-auto">
      <div className="flex items-center justify-center gap-[8px] w-full rounded-lg bg-light-700 dark:bg-dark-400 dark:bg-opacity-80">
        <Button className="shadow-none border-none flex items-center justify-center w-full bg-transparent">
          <p className="text-dark100_light900  paragraph-semibold">Remove</p>
        </Button>
      </div>
      <div className="flex items-center justify-center gap-[8px] w-full rounded-lg bg-accent-red bg-opacity-20">
        <Button className="shadow-none border-none flex items-center justify-center w-full bg-transparent">
          <p className="text-accent-red paragraph-semibold">{displayLabel}</p>
        </Button>
      </div>
    </div>
  );
};

export default MoreBottom;
