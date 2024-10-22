import React, { useEffect, useRef } from "react";
import SegmentMess from "../SegmentMess";
import Image from "next/image";
import { SegmentGroupProps, SegmentMessProps } from "@/types/mess-group";
import { formatTime } from "@/lib/utils";

interface RightMiddleProps {
  filteredSegmentAdmin: SegmentMessProps[] | SegmentGroupProps[];
  filteredSegmentOther: SegmentMessProps[] | SegmentGroupProps[];
}

const RightMiddle = ({
  filteredSegmentAdmin,
  filteredSegmentOther
}: RightMiddleProps) => {
  const combinedSegments = [
    ...filteredSegmentAdmin,
    ...filteredSegmentOther
  ].sort(
    (a, b) => new Date(a.time || 0).getTime() - new Date(b.time || 0).getTime()
  );

  //DISPLAY MESSAGE
  let groupedMessages: SegmentMessProps[] = [];
  let messagesToDisplay: SegmentMessProps[][] = [];
  combinedSegments.forEach((item, index) => {
    if (groupedMessages.length === 0) {
      groupedMessages.push(item);
    } else {
      const lastItem = groupedMessages[groupedMessages.length - 1];

      // Check time
      const timeDiff =
        (new Date(item.time || 0).getTime() -
          new Date(lastItem.time || 0).getTime()) /
        60000;

      if (item.userId === lastItem.userId && timeDiff < 1) {
        groupedMessages.push(item);
      } else {
        if (lastItem.userId === "001") {
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
    // Cuộn đến đáy khi component được render
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messagesToDisplay]);

  return (
    <div
      className="flex flex-col flex-grow overflow-scroll scrollable h-[591px]"
      ref={messageContainerRef}
    >
      <div className="flex-grow">
        <div className="flex flex-col justify-end items-center w-full h-full gap-[10px] py-4 ">
          {messagesToDisplay.map((group, index) => {
            const prevGroup = messagesToDisplay[index - 1];
            let timeDifference = 0;

            if (prevGroup) {
              timeDifference =
                group[0].time && prevGroup?.[prevGroup.length - 1]?.time
                  ? Math.abs(
                      new Date(group[0].time).getTime() -
                        new Date(prevGroup[prevGroup.length - 1].time).getTime()
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
                    {formatTime(group[0].time)}
                  </div>
                )}
                <div className="flex flex-col w-full">
                  <div
                    key={index}
                    className={`flex w-full ${
                      group[0].userId === "001"
                        ? "justify-end"
                        : "justify-start"
                    } gap-3`}
                  >
                    {group[0].userId !== "001" && (
                      <div className="flex items-end h-full w-7 flex-shrink-0 relative">
                        <Image
                          src={
                            group[0].ava
                              ? group[0].ava
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
                        group[0].userId === "001" ? "items-end" : "items-start"
                      }`}
                    >
                      {group.map((item, itemIndex) => (
                        <SegmentMess
                          key={itemIndex}
                          segments={item}
                          index={itemIndex}
                          length={group.length}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RightMiddle;
