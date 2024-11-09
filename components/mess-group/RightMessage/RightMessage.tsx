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
import { apiGroupInfo, dataChat, dataGroup } from "@/lib/dataBox";
import { fetchUser, userData, UserInfo } from "@/lib/dataUser";
import {
  fetchMessages,
  messageData,
  RenderMessageSegment,
  ResponseMessageDTO
} from "@/lib/dataMessages";

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
  const isGroup = /^\/group-chat\/\d+$/.test(pathname);

  //FetchDataChat Backend
  const [adminId, setAdminId] = useState("");
  const [adminInfo, setAdminInfo] = useState<UserInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState<RenderMessageSegment[]>([]);
  const [messageGroup, setMessageGroup] = useState<RenderMessageSegment[]>([]);

  //boxId
  const boxId = pathname.split("/").pop();
  const chatBox = dataChat.find((item) => item.id === boxId);
  const groupBox = dataGroup.find((item) => item.id === boxId);
  const groupInfo = apiGroupInfo.find((item) => item.id === boxId);

  useEffect(() => {
    const apiUserId = chatBox?.otherId;
    if (apiUserId) {
      setUserId(apiUserId);
    }

    const fetchData = async () => {
      const apiAdminId = localStorage.getItem("adminId");
      if (apiAdminId) {
        setAdminId(apiAdminId);
      }

      try {
        // Fetch Admin Info
        if (adminId) {
          const adminData = await fetchUser(adminId);
          setAdminInfo(adminData);
          console.log("Admin info:", adminData);
        }

        // Fetch User Info
        if (userId) {
          const userData = await fetchUser(userId);
          setUserInfo(userData);
          console.log("User Info:", userData);
        }

        // Fetch Segment Messages
        if (boxId) {
          const messageData = await fetchMessages(boxId);
          setMessages(messageData);
          console.log("Messages:", messages);
        } else {
          console.error("Error: Can't get boxId from pathname");
        }

        //Fetch Segment Group Messages
        if (boxId) {
          const messageData = await fetchMessages(boxId);
          setMessageGroup(messageData);
          console.log("Messages:", messageGroup);
        } else {
          console.error("Error: Can't get boxId of Group from pathname");
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
      }
    };

    fetchData();
  }, [adminId, userId, boxId]);

  //RightTop
  const top = isGroup
    ? {
        ava: groupInfo ? groupInfo.ava : "/assets/ava/default.png",
        name: groupInfo ? groupInfo.name : "Unknown name",
        membersGroup: groupInfo ? groupInfo.members.length : 0,
        onlineGroup: 0,
        openMore: openMore,
        setOpenMore: setOpenMore
      }
    : {
        ava: userInfo ? userInfo.avatar : "/assets/ava/default.png",
        name: userInfo ? userInfo.nickName : "Unknown name",
        membersGroup: 0,
        onlineGroup: 0,
        openMore: openMore,
        setOpenMore: setOpenMore
      };

  //filterSegment
  const filteredSegmentAdmin = isGroup
    ? messageGroup.filter((item) => item.infoCreateBy.id === adminId)
    : messages.filter((item) => item.infoCreateBy.id === adminId);
  const filteredSegmentOther = isGroup
    ? messageGroup.filter((item) => item.infoCreateBy.id !== adminId)
    : messages.filter((item) => item.infoCreateBy.id !== adminId);

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
          />

          <RightBottom />
        </div>
      </div>
      <OpenMoreDisplay display={display} />
    </div>
  );
};

export default RightMessage;
