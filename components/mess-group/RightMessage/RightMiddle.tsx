"use client";
import React, { useEffect, useRef, useState } from "react";
import SegmentMess from "../SegmentMess";
import Image from "next/image";
import { formatTime } from "@/lib/utils";

import MenubarSegment from "@/components/mess-group/RightMessage/Segment/menubar-segment";
import { useUserContext } from "@/context/UserContext";
import { useChatContext } from "@/context/ChatContext";
import { getPusherClient } from "@/lib/pusher";
import { usePathname } from "next/navigation";
import {
  ReadedStatusPusher,
  ResponseMessageDTO,
  TextingEvent,
  UserInfoBox
} from "@/lib/DTO/message";

interface RightMiddleProps {
  filteredSegmentAdmin: ResponseMessageDTO[];
  filteredSegmentOther: ResponseMessageDTO[];
  receiverInfo: UserInfoBox[];
  relation?: string;
}

const RightMiddle = ({
  filteredSegmentAdmin,
  filteredSegmentOther,
  receiverInfo,
  relation
}: RightMiddleProps) => {
  const { adminInfo } = useUserContext();
  const adminId = adminInfo._id;
  const [isTexting, setIsTexting] = useState<Record<string, TextingEvent>>({});
  const pathname = usePathname();
  const boxId = pathname.split("/").pop();
  const { readedIdByBox, dataChat, setReadedIdByBox } = useChatContext();
  const [avaArray, setAvaArray] = useState<string[]>([]);
  const combinedSegments = [
    ...filteredSegmentAdmin,
    ...filteredSegmentOther
  ].sort(
    (a, b) =>
      new Date(a.createAt || 0).getTime() - new Date(b.createAt || 0).getTime()
  );

  //DISPLAY MESSAGE
  let groupedMessages: ResponseMessageDTO[] = [];
  let messagesToDisplay: ResponseMessageDTO[][] = [];
  combinedSegments.forEach((item, index) => {
    if (groupedMessages.length === 0) {
      groupedMessages.push(item);
    } else {
      const lastItem = groupedMessages[groupedMessages.length - 1];

      // Check time
      const timeDiff =
        (new Date(item.createAt || 0).getTime() -
          new Date(lastItem.createAt || 0).getTime()) /
        60000;

      if (item.createBy === lastItem.createBy && timeDiff < 1) {
        groupedMessages.push(item);
      } else {
        if (lastItem.createBy === adminId) {
          messagesToDisplay.push([...groupedMessages]);
        } else {
          messagesToDisplay.push([...groupedMessages]);
        }

        // Reset mảng gộp và thêm item hiện tại vào mảng gộp
        groupedMessages = [item];
      }
    }

    // Nếu đây là item cuối cùng, kiểm tra lại
    if (index === combinedSegments.length - 1) {
      messagesToDisplay.push([...groupedMessages]); // Đưa phần tử cuối cùng vào mảng hiển thị
    }
  });
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth" // Thêm hiệu ứng mượt mà
      });
    }
  }, [messagesToDisplay]);

  //Texting Event
  useEffect(() => {
    const handleTexting = (data: TextingEvent) => {
      console.log("Successfully received texting-status:", data);

      if (adminId !== "" && data.userId !== adminId) {
        setIsTexting((prevState) => {
          const updatedState = { ...prevState };

          if (data.texting) {
            updatedState[data.userId] = data;
          } else {
            delete updatedState[data.userId];
          }

          return updatedState;
        });
      }
    };

    const pusherClient = getPusherClient();
    if (boxId) {
      const channel = pusherClient.subscribe(`private-${boxId}`);
      channel.bind("texting-status", handleTexting);
    }
  });

  //Readed status
  useEffect(() => {
    const pusherClient = getPusherClient();

    const handleReadedId = (data: ReadedStatusPusher) => {
      console.log("Successfully received readed-status:", data);
      setReadedIdByBox((prevState) => ({
        ...prevState,
        [data.boxId]: data.readedId
      }));
    };

    dataChat.forEach((box) => {
      pusherClient.subscribe(`private-${box.id}`);
      pusherClient.bind("readed-status", handleReadedId);
    });
  });

  useEffect(() => {
    if (boxId && readedIdByBox?.[boxId]) {
      const detailByBox = dataChat.find((box) => box.id === boxId);
      if (detailByBox) {
        const avatars = detailByBox.memberInfo
          .filter((item) => item._id !== adminId)
          .filter((user) => readedIdByBox[boxId].includes(user._id))
          .map((user) => user.avatar);

        setAvaArray(avatars);
      }
    }
  }, [readedIdByBox, boxId]);

  console.log(avaArray, "avatar");
  console.log(boxId ? readedIdByBox[boxId] : "", "readed");
  return (
    <div
      className="flex w-full h-fit overflow-scroll custom-scrollbar "
      ref={messageContainerRef}
    >
      <div
        className={`flex flex-col flex-grow pr-2 ${
          relation === "blocked" || relation === "blockedBy"
            ? "h-[530px]"
            : "h-[591px]"
        } `}
      >
        <div className="flex-grow">
          <div className="flex flex-col justify-end items-center w-full h-full gap-[10px] py-4 ">
            {messagesToDisplay.map((group, index) => {
              //Get info receiver
              const targetId = group[0].createBy;
              const foundItem = receiverInfo.find(
                (item) => item._id === targetId
              );

              const prevGroup = messagesToDisplay[index - 1];
              let timeDifference = 0;

              if (prevGroup) {
                timeDifference =
                  group[0].createAt &&
                  prevGroup?.[prevGroup.length - 1]?.createAt
                    ? Math.abs(
                        new Date(group[0].createAt).getTime() -
                          new Date(
                            prevGroup[prevGroup.length - 1].createAt
                          ).getTime()
                      ) /
                      (1000 * 60)
                    : 0;
              }
              return (
                <div
                  className={`flex flex-col w-full  ${
                    (timeDifference >= 30 || !timeDifference) && "gap-[10px]"
                  }`}
                >
                  {(timeDifference >= 30 || !timeDifference) && (
                    <div className="md:body-regular small-regular text-dark100_light900 opacity-60 text-center">
                      {formatTime(new Date(group[0].createAt))}
                    </div>
                  )}
                  <div className="flex flex-col w-full">
                    <div
                      key={index}
                      className={`flex w-full ${
                        group[0].createBy === adminId
                          ? "justify-end"
                          : "justify-start"
                      } gap-3`}
                    >
                      {group[0].createBy !== adminId && (
                        <div className="flex items-end h-full w-7 flex-shrink-0 relative">
                          <Image
                            src={
                              foundItem?.avatar
                                ? foundItem?.avatar
                                : "/assets/ava/default.png"
                            }
                            alt=""
                            width={28}
                            height={28}
                            className="w-7 h-7 cursor-pointer rounded-full object-cover"
                          />
                        </div>
                      )}

                      <div
                        className={`flex flex-col h-full flex-grow gap-[2px] max-w-[46%] ${
                          group[0].createBy === adminId
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        {group.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`relative group h-full flex flex-row  items-center justify-start`} // Thêm lớp để nhóm hover
                          >
                            {item.createBy === adminId &&
                              item.flag === true && (
                                <MenubarSegment
                                  createAt={new Date(
                                    item.createAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true // Định dạng AM/PM
                                  })}
                                  admin={adminId}
                                  messageId={item.id}
                                  boxId={item.boxId}
                                />
                              )}
                            <SegmentMess
                              segments={item}
                              index={itemIndex}
                              length={group.length}
                              recieverInfo={receiverInfo}
                            />
                            {item.createBy !== adminId &&
                              item.flag === true && (
                                <MenubarSegment
                                  createAt={new Date(
                                    item.createAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true // Định dạng AM/PM
                                  })}
                                  messageId={item.id}
                                  boxId={item.boxId}
                                />
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {Object.entries(isTexting).filter(([key, value]) => value.texting) // Lọc các entry có value.texting là true
            .length > 0 && (
            <div
              className={`flex w-full justify-start items-center gap-3 pb-4 pt-1 h-auto`}
            >
              <div
                className="flex items-center w-7 h-7 justify-center flex-shrink-0 relative"
                style={{
                  width: `calc(28px * ${Math.min(
                    3,
                    Object.entries(isTexting).filter(
                      ([key, value]) => value.texting
                    ).length
                  )} + 16px * ${Math.max(
                    0,
                    Math.min(
                      2,
                      Object.entries(isTexting).filter(
                        ([key, value]) => value.texting
                      ).length - 1
                    )
                  )})`
                }}
              >
                {Object.entries(isTexting)
                  .filter(([key, value]) => value.texting)
                  .slice(0, 3)
                  .map(([key, value], index) => (
                    <div
                      key={index}
                      className={`absolute rounded-full bg-light-800 dark:bg-dark-500 ${
                        index === 0
                          ? "left-0"
                          : index === 1
                          ? "left-4"
                          : "left-8"
                      }`}
                    >
                      <Image
                        src={
                          value.avatar
                            ? value.avatar
                            : "/assets/ava/default.png"
                        }
                        alt="Avatar"
                        width={28}
                        height={28}
                        className="w-7 h-7 cursor-pointer rounded-full object-cover"
                      />
                    </div>
                  ))}
                {/* <div className={`absolute ${"left-0"}`}>
                <Image
                  src="/assets/ava/ava1.jpg"
                  alt="Avatar"
                  width={28}
                  height={28}
                  className="w-7 h-7 cursor-pointer rounded-full object-cover"
                />
              </div> */}
              </div>

              <div
                className={`flex flex-col h-full flex-grow gap-[2px] max-w-[46%] items-start`}
              >
                <div className="relative group h-full flex flex-row gap-2 items-center justify-start">
                  <div className="flex w-fit h-9 items-center justify-center bg-light-800 dark:bg-dark-500 dark:bg-opacity-50 px-3 py-2 rounded-[18px] gap-2 ">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {avaArray.length > 0 && (
            <div className="flex flex-row gap-1 w-full h-fit justify-end items-center">
              {avaArray.slice(0, 5).map((item, index) => (
                <Image
                  key={index}
                  src={item ? item : "/assets/ava/default.png"}
                  alt="Avatar"
                  width={12}
                  height={12}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightMiddle;
