"use client";

import RightMessage from "@/components/mess-group/RightMessage/RightMessage";
import LeftMessage from "@/components/mess-group/LeftMessage/LeftMessage";
import { useEffect, useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import { isCurrentPageBoxId } from "@/lib/utils";
import { markMessageAsRead } from "@/lib/services/message/read-mark";
import { getPusherClient } from "@/lib/pusher";
import { ResponseMessageDTO } from "@/lib/DTO/message";
import { fetchMessages } from "@/lib/data/message/dataMessages";

const page = () => {
  const [isClickBox, setClickBox] = useState(true);
  const [isClickOtherRight, setClickOtherRight] = useState(false);
  const divClassName = "flex h-full lg:hidden md:hidden w-full ";
  //Click open more responsive
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      // Kiểm tra kích thước cửa sổ
      if (window.innerWidth >= 768 && window.innerWidth < 878) {
        setIsMdScreen(true);
      } else {
        setIsMdScreen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Fetch Box Chat from Backend
  const { dataChat, setMessagesByBox, setReadStatusByBox } = useChatContext();

  // Fetch messages
  useEffect(() => {
    const fetchMessagesForBoxes = async () => {
      const messagesMap: Record<string, ResponseMessageDTO[]> = {};

      for (const box of dataChat) {
        const boxMessages = await fetchMessages(box.id);
        messagesMap[box.id] = boxMessages;
      }

      setMessagesByBox(messagesMap);
    };

    fetchMessagesForBoxes();
  }, [dataChat]);

  //Subcribe channel in pusher
  useEffect(() => {
    for (const box of dataChat) {
      const pusherClient = getPusherClient();
      pusherClient.subscribe(`private-${box.id}`);
    }
  }, [dataChat]);

  //Fetch Detail Box Chat from Backend
  const readStatusMap: Record<string, boolean> = {};
  useEffect(() => {
    const fetchDataForBoxes = async () => {
      if (dataChat.length === 0) {
        console.log("dataChat is empty");
        return;
      }

      for (const box of dataChat) {
        if (box) {
          if (isCurrentPageBoxId(box.id)) {
            const readMess = await markMessageAsRead(box.id);
            readStatusMap[box.id] = readMess;
          } else {
            readStatusMap[box.id] = box.readStatus;
          }
        } else {
          console.log(`No detail for box: ${box}`);
        }
      }
      setReadStatusByBox(readStatusMap);
    };

    fetchDataForBoxes();
  }, [dataChat]);

  return (
    <section className="py-[16px] pr-[16px] w-full flex h-full">
      <div className={`flex flex-row w-full`}>
        {divClassName.includes("w-full") &&
          (isClickBox ? (
            <div className="flex md:hidden h-full w-full bg-transparent ">
              <RightMessage
                setClickBox={setClickBox}
                setClickOtherRight={setClickOtherRight}
                isClickOtherRight={isClickOtherRight}
                setOpenMore={setOpenMore}
                openMore={openMore}
              />
            </div>
          ) : (
            <div className={divClassName}>
              <LeftMessage
                setClickBox={setClickBox}
                setClickOtherRight={setClickOtherRight}
              />
            </div>
          ))}
        <div
          className={`md:flex hidden h-full  ${
            isMdScreen && openMore ? "w-[70%]" : "lg:w-[25.6608%]  w-[30%]"
          }`}
        >
          <LeftMessage />
        </div>
        <div className="md:flex hidden h-full w-full bg-transparent ">
          <RightMessage
            setOpenMore={setOpenMore}
            openMore={openMore}
            setClickOtherRight={setClickOtherRight}
          />
        </div>
      </div>
    </section>
  );
};

export default page;
