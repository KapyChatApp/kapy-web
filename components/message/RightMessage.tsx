"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { segmentsMess } from "@/constants/messenger";
import RightTop from "../mess-group/RightTop";
import RightBottom from "../mess-group/RightBottom";
import SegmentMess from "../mess-group/SegmentMess";
import MoreActions from "../mess-group/MoreActions/MoreActions";
import { user } from "@/constants/object";
import FindComponent from "../mess-group/MoreActions/FindComponent";
import ManagementComponent from "../mess-group/MoreActions/ManagementComponent";
import AddComponent from "../mess-group/MoreActions/AddComponent";

const RightMessage = () => {
  const [openMore, setOpenMore] = useState(false);

  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const userInfo = user.filter((info) => info.id === id);

  const top = {
    ava: userInfo[userInfo.length - 1].ava,
    name: userInfo[userInfo.length - 1].name,
    membersGroup: 0,
    onlineGroup: 0,
    openMore: openMore,
    setOpenMore: setOpenMore
  };

  const [activeComponent, setActiveComponent] = useState<string>("");
  const renderComponent = () => {
    switch (activeComponent) {
      case "find":
        return <FindComponent setActiveComponent={setActiveComponent} />;
      case "manage":
        return <ManagementComponent setActiveComponent={setActiveComponent} />;
      case "add":
        return <AddComponent setActiveComponent={setActiveComponent} />;
      default:
        return <MoreActions setActiveComponent={setActiveComponent} />;
    }
  };

  return (
    <div className="flex flex-row w-full h-full">
      <div
        className={`${
          openMore ? "w-[66%]" : "w-full"
        } flex background-light900_dark400 rounded-tr-[12px] rounded-br-[12px] pl-[16px]`}
      >
        <div
          className={`flex flex-col flex-1 w-full py-[16px] px-[12px] justify-between`}
        >
          <RightTop top={top} />

          {/*Middle */}
          <div className="flex flex-row flex-grow justify-between w-full overflow-scroll scrollable py-4">
            <div className="flex flex-col w-[50%] items-start justify-start gap-3">
              <div className="flex flex-row gap-3">
                {segmentsMess.filter((item) => item.userId === id).length >
                  0 && (
                  <div className="flex items-start">
                    <Image
                      src={
                        segmentsMess.find((item) => item.userId === id)?.ava ||
                        ""
                      }
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                )}

                <div className="flex flex-col mt-1 gap-[2px]">
                  {segmentsMess
                    .filter((item) => item.userId === id)
                    .map((item) => (
                      <SegmentMess key={item.userId} segments={item} />
                    ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[50%] justify-end items-end">
              <div className="flex flex-col mt-1 gap-[2px] items-end">
                {segmentsMess
                  .filter((item) => item.userId === "001")
                  .map((item) => (
                    <SegmentMess key={item.userId} segments={item} />
                  ))}
              </div>
            </div>
          </div>

          <RightBottom />
        </div>
      </div>

      {openMore ? (
        activeComponent ? (
          <div className="flex background-light850_dark200 flex-grow scrollable overflow-scroll px-4 w-[40%] h-full">
            {renderComponent()}
          </div>
        ) : (
          <div className="flex background-light850_dark200 flex-grow scrollable overflow-scroll px-4 w-[40%]">
            <MoreActions setActiveComponent={setActiveComponent} />
          </div>
        )
      ) : null}
    </div>
  );
};

export default RightMessage;
