import React from "react";
import SegmentMess from "../SegmentMess";
import Image from "next/image";
import { SegmentGroupProps, SegmentMessProps } from "@/types/mess-group";

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
    // Nếu không có tin nhắn trong mảng gộp thì thêm vào
    if (groupedMessages.length === 0) {
      groupedMessages.push(item);
    } else {
      const lastItem = groupedMessages[groupedMessages.length - 1];

      // Kiểm tra nếu ID của item hiện tại giống ID của item cuối cùng trong mảng gộp
      if (item.userId === lastItem.userId) {
        groupedMessages.push(item); // Thêm vào mảng gộp
      } else {
        // Nếu gặp ID admin (trong trường hợp không phải là admin)
        if (lastItem.userId === "001") {
          messagesToDisplay.push([...groupedMessages]); // Chuyển mảng gộp vào mảng hiển thị
        } else {
          // Nếu không phải là admin, thêm nhóm trước vào mảng hiển thị
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

  return (
    <div className="flex flex-col flex-grow justify-end items-center w-full gap-[6px] overflow-scroll scrollable py-4">
      {messagesToDisplay.map((group, index) => (
        <div className="flex flex-col w-full">
          <div
            key={index}
            className={`flex w-full ${
              group[0].userId === "001" ? "justify-end" : "justify-start"
            } gap-3`}
          >
            {group[0].userId !== "001" && (
              <div className="flex items-end h-full w-7 flex-shrink-0 relative">
                <Image
                  src={group[0].ava ? group[0].ava : "/assets/ava/default.png"}
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
      ))}
    </div>
  );
};

export default RightMiddle;
