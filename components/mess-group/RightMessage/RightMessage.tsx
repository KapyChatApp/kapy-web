"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { segmentsMess } from "@/constants/messenger";
import RightTop from "./RightTop";
import RightBottom from "./RightBottom";
import { group, user } from "@/constants/object";
import RightMiddle from "./RightMiddle";
import OpenMoreDisplay from "./OpenMoreDisplay";
import { segmentsGroup } from "@/constants/groups";

interface RightMessageProps {
  setClickBox?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickOtherRight?: React.Dispatch<React.SetStateAction<boolean>>;
  isClickOtherRight?: boolean;
  openMore: boolean;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightMessage = ({
  setClickBox,
  setClickOtherRight,
  isClickOtherRight,
  openMore,
  setOpenMore
}: RightMessageProps) => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const isGroup = /^\/groups\/\d+$/.test(pathname);

  //Messages
  const userInfo = user.filter((info) => info.id === id);
  //Groups
  const groupInfo = group.filter((info) => info.id === id);
  const online = group.filter((info) =>
    info.members.filter((online) => online.isOnline)
  );

  //RightTop
  const top = isGroup
    ? {
        ava: groupInfo[groupInfo.length - 1].ava,
        name: groupInfo[groupInfo.length - 1].name,
        membersGroup: groupInfo[groupInfo.length - 1].members.length,
        onlineGroup: online.length,
        openMore: openMore,
        setOpenMore: setOpenMore
      }
    : {
        ava: userInfo[userInfo.length - 1].ava,
        name: userInfo[userInfo.length - 1].name,
        membersGroup: 0,
        onlineGroup: 0,
        openMore: openMore,
        setOpenMore: setOpenMore
      };

  //filterSegment
  const filteredSegmentAdmin = isGroup
    ? segmentsGroup.filter(
        (item) => item.userId === "001" && item.groupId === id
      )
    : segmentsMess.filter(
        (item) => item.userId === "001" && item.recipientId === id
      );
  const filteredSegmentOther = isGroup
    ? segmentsGroup.filter(
        (item) => item.userId !== "001" && item.groupId === id
      )
    : segmentsMess.filter((item) => item.userId === id);

  //OpenMoreDisplay
  const display = {
    openMore,
    setOpenMore,
    isClickOtherRight,
    setClickOtherRight
  };

  //Open More Responsive
  const [isMdScreen, setIsMdScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      // Kiểm tra kích thước cửa sổ
      if (window.innerWidth >= 768 && window.innerWidth < 878) {
        setIsMdScreen(true);
      } else {
        setIsMdScreen(false);
      }
    };
    // Kiểm tra kích thước ngay khi component render lần đầu
    handleResize();
    // Lắng nghe sự kiện thay đổi kích thước cửa sổ
    window.addEventListener("resize", handleResize);
    // Hủy lắng nghe sự kiện khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-row w-full h-full">
      <div
        className={`${
          isMdScreen && openMore
            ? "w-0"
            : openMore
            ? "xl:w-[66%] lg:w-[60%] md:w-[66%] w-full"
            : "w-full"
        } ${
          isClickOtherRight ? "hidden" : "flex"
        }  background-light900_dark400 rounded-tr-[12px] rounded-br-[12px] pl-[16px] rounded-tl-[12px] rounded-bl-[12px] lg:rounded-tl-[0px] lg:rounded-bl-[0px] md:rounded-tl-[0px] md:rounded-bl-[0px]`}
      >
        <div
          className={` ${
            isMdScreen && openMore
              ? "hidden"
              : "flex flex-col flex-1 w-full py-[16px] md:px-[12px] pl-0 pr-[12px] justify-between"
          }`}
        >
          <RightTop
            top={top}
            setClickBox={setClickBox}
            setClickOtherRight={setClickOtherRight}
          />

          <RightMiddle
            filteredSegmentAdmin={filteredSegmentAdmin}
            filteredSegmentOther={filteredSegmentOther}
          />

          <RightBottom />
        </div>
      </div>
      <OpenMoreDisplay display={display} />
    </div>
  );
};

export default RightMessage;
