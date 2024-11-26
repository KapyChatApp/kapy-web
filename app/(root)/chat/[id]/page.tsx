"use client";
import LeftMessage from "@/components/mess-group/LeftMessage/LeftMessage";
import RightMessage from "@/components/mess-group/RightMessage/RightMessage";
import { useEffect, useState } from "react";
import { fetchMessages, ResponseMessageDTO } from "@/lib/dataMessages";
import { useChatContext } from "@/context/ChatContext";
import { DetailBox, fetchDetailBox } from "@/lib/dataOneBox";
const page = () => {
  const [isClickBox, setClickBox] = useState(true);
  const [isClickOtherRight, setClickOtherRight] = useState(false);
  const divClassName = "flex h-full lg:hidden md:hidden w-full ";
  //Click open more responsive
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  useEffect(() => {
    const handleResize = () => {
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
  const { dataChat, setMessagesByBox, setDetailByBox, detailByBox } =
    useChatContext();
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
  }, []);

  //Fetch Detail Box Chat from Backend
  useEffect(() => {
    const fetchDataForBoxes = async () => {
      const detailBoxMap: Record<string, DetailBox> = {};

      if (dataChat.length === 0) {
        console.log("dataChat is empty");
        return;
      }

      for (const box of dataChat) {
        const detail = await fetchDetailBox(box.id);

        if (detail) {
          detailBoxMap[box.id] = detail;
        } else {
          console.log(`No detail for box: ${box.id}`);
        }
      }

      // Only set if there is data
      if (Object.keys(detailBoxMap).length > 0) {
        setDetailByBox(detailBoxMap);
      } else {
        console.log("No details to set in detailBox");
      }
    };

    fetchDataForBoxes();
  }, [dataChat, setDetailByBox]);
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
            isMdScreen && openMore ? "w-[70%]" : "lg:w-[28%] md:w-[27%] w-[30%]"
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
