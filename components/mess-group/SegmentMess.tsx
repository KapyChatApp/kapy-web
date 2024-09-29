import { SegmentMessProps } from "@/types/mess-group";
import Image from "next/image";

import { usePathname } from "next/navigation";
import React from "react";

interface SegmentMessage {
  segments: SegmentMessProps;
}

const SegmentMess: React.FC<SegmentMessage> = ({ segments }) => {
  const pathname = usePathname();

  const { userId, content } = segments;
  const isActive = userId !== "001";
  return (
    <div className={`flex flex-row items-center justify-start w-fit gap-2`}>
      <div
        className={`${
          isActive
            ? "bg-light-800 dark:bg-dark-500 dark:bg-opacity-50"
            : "bg-primary-500"
        } rounded-[18px] flex flex-wrap w-fit px-3 py-1`}
      >
        <p
          className={`${
            isActive ? "text-dark900_light100" : "text-light-900"
          } flex-wrap text-[14px] font-[320px]`}
        >
          {content}
        </p>
      </div>
    </div>
  );
};

export default SegmentMess;
