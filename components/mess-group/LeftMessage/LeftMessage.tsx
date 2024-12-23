"use client";
import React, { useCallback, useEffect, useState } from "react";
import GlobalSearch from "../../shared/search/globalSearch";
import MessageBox from "../MessageBox";
import useSearchMessageBox from "@/hooks/use-search-message-box";
import { usePathname } from "next/navigation";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import CreateGroup from "./CreateGroup";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import { fetchMessageBox } from "@/lib/data/message/dataBox";
import { fetchMessageBoxGroup } from "@/lib/data/message/dataBoxGroup";
import LeftMessageRaw from "../UI-Raw/LeftMessageRaw";
import { ResponseMessageDTO } from "@/lib/DTO/message";
import { fetchMessages } from "@/lib/data/message/dataMessages";

export interface LeftMessageProps {
  setClickBox?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickOtherRight?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeftMessage = ({ setClickBox, setClickOtherRight }: LeftMessageProps) => {
  const pathname = usePathname();
  const isGroup = pathname.startsWith("/group-chat");
  const {
    dataChat,
    setDataChat,
    setMessagesByBox,
    setReadStatusByBox,
    setReadedIdByBox
  } = useChatContext();
  const [error, setError] = useState("");
  //OPEN MODAL CreateGroup
  const [isCreated, setCreated] = useState(false);
  const handleCreated = () => {
    setCreated(!isCreated);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminId = localStorage.getItem("adminId");
        if (!adminId) return;

        const data = isGroup
          ? await fetchMessageBoxGroup(setError)
          : await fetchMessageBox(adminId, setError);

        const messagesMap: Record<string, ResponseMessageDTO[]> = {};

        for (const box of data) {
          const boxMessages = await fetchMessages(box.id);
          messagesMap[box.id] = boxMessages;
        }

        for (const box of data) {
          setReadStatusByBox((prevState) => ({
            ...prevState,
            [box.id]: box.readStatus
          }));
          setReadedIdByBox((prevState) => ({
            ...prevState,
            [box.id]: box.readedId
          }));
        }

        setDataChat(data);
        setMessagesByBox(messagesMap);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchData();
  }, [isGroup]);

  const { searchTerm, setSearchTerm, filteredBox } =
    useSearchMessageBox(dataChat);

  if (!dataChat.length) {
    return <LeftMessageRaw />;
  }

  return (
    <>
      <div className="flex flex-col background-light900_dark400 h-full py-[16px] px-[8px] rounded-tl-[12px] rounded-bl-[12px] rounded-tr-[12px] rounded-br-[12px] lg:rounded-tr-[0px] lg:rounded-br-[0px] md:rounded-tr-[0px] md:rounded-br-[0px] w-full">
        <p className="text-xl lg:text-2xl font-medium lg:font-bold text-dark100_light900 px-2">
          {isGroup ? "Groups" : "Messages"}
        </p>

        <GlobalSearch onChange={(e) => setSearchTerm(e.target.value)} />

        <div className="mt-[12px] flex w-full flex-col scrollable overflow-scroll">
          {filteredBox.length > 0
            ? filteredBox.map((item) => {
                return (
                  <MessageBox
                    box={item}
                    setClickBox={setClickBox}
                    setClickOtherRight={setClickOtherRight}
                  />
                );
              })
            : null}
        </div>

        {isGroup && (
          <div className="flex flex-row mt-auto justify-start w-full">
            <Button
              className="shadow-none border-none min-w-fit bg-transparent min-h-fit p-0 flex flex-row items-center justify-start"
              onClick={handleCreated}
            >
              <div className="rounded-full p-[12px] bg-primary-500 bg-opacity-20">
                <Icon
                  icon="mingcute:add-fill"
                  className=" text-primary-500  "
                />
              </div>
              <p className="paragraph-semibold text-primary-500 ml-[12px]">
                Create group
              </p>
            </Button>
          </div>
        )}
      </div>

      {isCreated && <CreateGroup setCreated={setCreated} />}
    </>
  );
};

export default LeftMessage;
