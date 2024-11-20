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
import { fetchUser, userData, UserInfo } from "@/lib/dataUser";
import {
  fetchMessages,
  messageData,
  ResponseMessageDTO
} from "@/lib/dataMessages";
import { detailBox, detailDataBox, fetchDetailBox } from "@/lib/dataOneBox";

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
  const [recipientId, setRecipientId] = useState<string[] | undefined>(
    undefined
  );
  const [detailBox, setDetailBox] = useState<detailBox>();
  const [userInfo, setUserInfo] = useState<UserInfo[] | null>(null);
  const [senderInfo, setSenderInfo] = useState<UserInfo>();
  const [messages, setMessages] = useState<ResponseMessageDTO[]>([]);
  const [messageGroup, setMessageGroup] = useState<ResponseMessageDTO[]>([]);

  //boxId
  const boxId = pathname.split("/").pop();
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    let isMounted = true; // Cờ kiểm soát để ngăn setState nếu component đã unmount
    const fetchData = async () => {
      //Get Deail MessageBox
      if (boxId) {
        try {
          await fetchDetailBox(boxId);
          if (detailDataBox && Array.isArray(detailDataBox.receiverIds)) {
            setDetailBox(detailDataBox);
            // Chắc chắn rằng receiverIds là mảng trước khi truy cập
            setUserInfo(detailDataBox.receiverIds);
            setSenderInfo(detailDataBox.senderId);
            setRecipientId(detailDataBox.receiverIds.map((item) => item.id));
          } else {
            console.error(
              "recieverIds is not an array or detailDataBox is undefined"
            );
          }
        } catch (error) {
          console.error("Error fetching detail box:", error);
        }
      }

      // Fetch Segment Group Messages
      if (isGroup) {
        if (boxId) {
          await fetchMessages(boxId);
          if (isMounted) {
            setMessageGroup(messageData);
            //console.log("Messages in Group:", messageData);
          }
        } else {
          console.error("Error: Can't get boxId of Group from pathname");
        }
      } else {
        // Fetch Admin Info
        // if (apiAdminId) {
        //   const adminData = await fetchUser(apiAdminId);
        //   if (isMounted) {
        //     setAdminInfo(adminData);
        //     console.log("Admin info:", adminData);
        //   }
        // }

        // Fetch User Info
        // if (userId && !userInfo) {
        //   if (isMounted) {
        //     await fetchUser(userId);
        //     setUserInfo(userData);
        //   }
        // }

        // Fetch Segment Messages
        if (boxId) {
          await fetchMessages(boxId);
          if (isMounted) {
            setMessages(messageData);
            //console.log("Messages in Chat:", messageData);
          }
        } else {
          console.error("Error: Can't get boxId from pathname");
        }
      }
    };

    fetchData();

    // Cleanup function to avoid memory leaks and unnecessary fetches
    return () => {
      isMounted = false;
    };
  }, [boxId, isGroup]);
  //RightTop
  let recieverInfo: UserInfo[] = [];
  if (userInfo) {
    recieverInfo = userInfo.filter((item) => item.id !== adminId);
  }
  const top = isGroup
    ? {
        ava: detailBox ? detailBox.groupAva : "/assets/ava/default.png",
        name: detailBox ? detailBox.groupName : "Unknown name",
        membersGroup: detailBox ? detailBox.receiverIds.length : 0,
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
          recieverInfo.length > 0 && recieverInfo[0].nickName !== ""
            ? recieverInfo[0].nickName || "Unknown name"
            : "Unknown name",

        membersGroup: 0,
        onlineGroup: 0,
        openMore: openMore,
        setOpenMore: setOpenMore
      };

  //filterSegment
  const filteredSegmentAdmin = isGroup
    ? messageGroup.filter((item) => item.createBy === adminId)
    : messages.filter((item) => item.createBy === adminId);
  const filteredSegmentOther = isGroup
    ? messageGroup.filter((item) => item.createBy !== adminId)
    : messages.filter((item) => item.createBy !== adminId);

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
            receiverInfo={isGroup ? (userInfo ? userInfo : []) : recieverInfo}
          />

          <RightBottom
            recipientIds={recipientId}
            boxId={boxId}
            setMessageSegment={isGroup ? setMessageGroup : setMessages}
            senderInfo={senderInfo}
          />
        </div>
      </div>
      <OpenMoreDisplay display={display} />
    </div>
  );
};

export default RightMessage;
