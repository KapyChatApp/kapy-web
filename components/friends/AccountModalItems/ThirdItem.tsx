"use client";
import ReportCard from "@/components/shared/ReportCard";
import { FriendProfileResponseDTO } from "@/lib/DTO/friend";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ThirdItemProps {
  user: FriendProfileResponseDTO;
}

const ThirdItem = ({ user }: ThirdItemProps) => {
  const [isReport, setReport] = useState(false);
  const onclose = () => {
    setReport(false);
  };
  const handleClick = () => {
    setReport(true);
  };
  return (
    <>
      <div className="flex flex-row items-start justify-between w-full h-fit">
        <div className="flex flex-row items-center justify-start h-fit w-fit gap-2">
          <p className="text-dark100_light900 body-regular lg:paragraph-15-regular">
            Points
          </p>
          <p className="text-dark100_light900 paragraph-15-light">
            ({user.point})
          </p>
        </div>
        <div
          className="flex flex-row flex-wrap justify-between items-center w-fit h-fit cursor-pointer gap-2"
          onClick={handleClick}
        >
          <p className="text-primary-100 body-light italic">Report</p>
          <Icon
            icon="mdi:user-alert-outline"
            width={20}
            height={20}
            className="text-primary-100"
          />
        </div>
      </div>
      {isReport && (
        <ReportCard onClose={onclose} type="User" reportedId={user._id} />
      )}
    </>
  );
};

export default ThirdItem;
