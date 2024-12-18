"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import RightTop from "./RightTop";
import RightBottom from "./RightBottom";
import RightMiddle from "./RightMiddle";
import OpenMoreDisplay from "./OpenMoreDisplay";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import { MessageBoxInfo, ResponseMessageDTO } from "@/lib/DTO/message";

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
  const pathname = usePathname();
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);

  //FetchMessage Backend
  const [recipientId, setRecipientId] = useState<string[]>();
  const [boxId, setBoxId] = useState<string>("");
  const [detailByBox, setDetailByBox] = useState<MessageBoxInfo>();
  const { dataChat, setIsReactedByMessage, messagesByBox } = useChatContext();
  const { adminInfo } = useUserContext();
  const adminId = adminInfo._id;

  //boxId
  useEffect(() => {
    // Lấy đường dẫn hiện tại từ URL
    const path = window.location.pathname;
    // Chia đường dẫn thành các phần và lấy phần cuối cùng (boxId)
    const parts = path.split("/");
    const id = parts.pop(); // Lấy phần cuối cùng của đường dẫn

    if (id) {
      setBoxId(id); // Set boxId là chuỗi
    }
  }, [boxId]);

  useEffect(() => {
    if (boxId !== "") {
      const detail = dataChat.find((box) => box.id === boxId);
      if (detail) {
        setDetailByBox(detail);
        setRecipientId(detail.memberInfo.map((item: any) => item.id));
      }
      if (messagesByBox && messagesByBox[boxId]) {
        const reactMap: Record<string, boolean> = {};
        for (const msg of messagesByBox[boxId]) {
          reactMap[msg.id] = msg.isReact.length > 0;
        }
        setIsReactedByMessage(reactMap);
      }
    }
  }, [boxId, dataChat, setDetailByBox]);

  //RightTop
  let top: any;
  if (boxId && detailByBox) {
    top = isGroup
      ? {
          ava: detailByBox.groupAva
            ? detailByBox.groupAva
            : "/assets/images/icon.png",
          name: detailByBox.groupName ? detailByBox.groupName : "Group Chat",
          membersGroup: detailByBox.memberInfo.length,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore
        }
      : {
          ava:
            detailByBox.receiverInfo && detailByBox.receiverInfo.avatar
              ? detailByBox.receiverInfo.avatar
              : "/assets/ava/default.png",

          name:
            detailByBox.receiverInfo &&
            detailByBox.receiverInfo.firstName !== "" &&
            detailByBox.receiverInfo.lastName !== ""
              ? detailByBox.receiverInfo.firstName +
                " " +
                detailByBox.receiverInfo.lastName
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
    detailByBox,
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
            receiverInfo={detailByBox ? detailByBox.memberInfo : []}
          />

          <RightBottom recipientIds={recipientId} />
        </div>
      </div>
      <OpenMoreDisplay display={display} />
    </div>
  );
};

export default RightMessage;
