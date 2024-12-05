"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import RightTop from "./RightTop";
import RightBottom from "./RightBottom";
import RightMiddle from "./RightMiddle";
import OpenMoreDisplay from "./OpenMoreDisplay";
import { ResponseMessageDTO } from "@/lib/dataMessages";
import { useChatContext } from "@/context/ChatContext";
import { UserInfoBox } from "@/lib/dataBox";
import { admin } from "@/constants/object";

interface RightMessageProps {
  setClickBox?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickOtherRight: React.Dispatch<React.SetStateAction<boolean>>;
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
  const { messagesByBox } = useChatContext();
  const pathname = usePathname();
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);

  //FetchMessage Backend
  const [recipientId, setRecipientId] = useState<string[]>();
  const [adminId, setAdminId] = useState<string>();
  const [recipientInfo, setRecipientInfo] = useState<UserInfoBox[]>();
  const [senderInfo, setSenderInfo] = useState<UserInfoBox>();
  const { detailByBox, setDetailByBox } = useChatContext();

  //boxId
  const boxId = pathname.split("/").pop();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
      setAdminId(adminId);
    }
    if (boxId && detailByBox && detailByBox[boxId]) {
      const detailDataBox = detailByBox[boxId];
      setRecipientInfo(detailDataBox.receiverIds);
      setSenderInfo(detailDataBox.senderId);
      setRecipientId(detailDataBox.receiverIds.map((item: any) => item.id));
    }
  }, [detailByBox]);

  //RightTop
  let recieverInfo: UserInfoBox[] = [];
  if (recipientInfo) {
    recieverInfo = recipientInfo.filter((item) => item.id !== adminId);
  }
  let top: any;
  if (boxId && detailByBox && detailByBox[boxId]) {
    top = isGroup
      ? {
          ava: detailByBox[boxId].groupAva,
          name: detailByBox[boxId].groupName,
          membersGroup: detailByBox[boxId].receiverIds.length,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore
        }
      : {
          ava:
            recieverInfo.length > 0 && recieverInfo[0].avatar !== ""
              ? recieverInfo[0].avatar
              : "/assets/ava/default.png",

          name:
            recieverInfo.length > 0 &&
            recieverInfo[0].firstName !== "" &&
            recieverInfo[0].lastName !== ""
              ? recieverInfo[0].firstName + " " + recieverInfo[0].lastName
              : "Unknown name",

          membersGroup: 0,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore
        };
  } else {
    top = isGroup
      ? {
          ava: "/assets/ava/default.png",
          name: "Unknown name",
          membersGroup: 0,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore
        }
      : {
          ava: "/assets/ava/default.png",
          name: "Unknown name",
          membersGroup: 0,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore
        };
  }
  //filterSegment
  let message: ResponseMessageDTO[] = [];
  if (boxId && messagesByBox && messagesByBox[boxId]) {
    message = messagesByBox[boxId];
  }
  const filteredSegmentAdmin = message.filter(
    (item) => item.createBy === adminId
  );
  const filteredSegmentOther = message.filter(
    (item) => item.createBy !== adminId
  );

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
      const otherRight = sessionStorage.getItem("otherRight");
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
              : "flex flex-col flex-1 w-full py-[16px] lg:px-[12px] pl-0 pr-[12px] justify-between"
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
            receiverInfo={
              isGroup ? (recipientInfo ? recipientInfo : []) : recieverInfo
            }
          />

          <RightBottom recipientIds={recipientId} senderInfo={senderInfo} />
        </div>
      </div>
      <OpenMoreDisplay display={display} />
    </div>
  );
};

export default RightMessage;
