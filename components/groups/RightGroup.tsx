"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { segmentsGroup } from "@/constants/groups";
import { usePathname } from "next/navigation";
import RightBottom from "../mess-group/RightBottom";
import RightTop from "../mess-group/RightTop";
import SegmentMess from "../mess-group/SegmentMess";
import MoreActions from "../mess-group/MoreActions/MoreActions";
import { group } from "@/constants/object";
import FindComponent from "../mess-group/MoreActions/FindComponent";
import ManagementComponent from "../mess-group/MoreActions/ManagementComponent";
import AddComponent from "../mess-group/MoreActions/AddComponent";
import SeeAllMember from "../mess-group/MoreActions/SeeAll/SeeAllMember";
import SeeAllFile from "../mess-group/MoreActions/SeeAll/SeeAllFile";
import SeeAllPhoto from "../mess-group/MoreActions/SeeAll/SeeAllPhoto";
import SeeAllLink from "../mess-group/MoreActions/SeeAll/SeeAllLink";
import SeeAllVideo from "../mess-group/MoreActions/SeeAll/SeeAllVideo";
import { MememberGroup } from "@/types/object";
import { Files, Links, Photo, Video } from "@/types/media";

const RightGroup = () => {
  const [openMore, setOpenMore] = useState(false);

  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const isActive = pathname === "/groups";

  const groupInfo = group.filter((info) => info.id === id);
  const online = group.filter((info) =>
    info.members.filter((online) => online.isOnline)
  );

  const top = {
    ava: groupInfo[groupInfo.length - 1].ava,
    name: groupInfo[groupInfo.length - 1].name,
    membersGroup: groupInfo[groupInfo.length - 1].members.length,
    onlineGroup: online.length,
    openMore: openMore,
    setOpenMore: setOpenMore
  };

  const [activeComponent, setActiveComponent] = useState<string>("");
  const [itemSent, setItemSent] = useState(
    [] as MememberGroup[] | Photo[] | Video[] | Files[] | Links[]
  );

  const renderComponent = () => {
    switch (activeComponent) {
      case "find":
        return <FindComponent setActiveComponent={setActiveComponent} />;
      case "manage":
        return <ManagementComponent setActiveComponent={setActiveComponent} />;
      case "add":
        return (
          <>
            <AddComponent setActiveComponent={setActiveComponent} />
            <MoreActions
              setActiveComponent={setActiveComponent}
              setItemSent={setItemSent}
              itemSent={itemSent}
            />
          </>
        );
      case "member":
        return (
          <SeeAllMember
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
      case "file":
        return (
          <SeeAllFile
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
      case "photo":
        return (
          <SeeAllPhoto
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
      case "link":
        return (
          <SeeAllLink
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
      case "video":
        return (
          <SeeAllVideo
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
      default:
        return (
          <MoreActions
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
    }
  };

  return (
    !isActive && (
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
                {segmentsGroup
                  .filter(
                    (group) => group.groupId === id && group.userId !== "001"
                  )
                  .map((item) => (
                    <div className="flex flex-row gap-3">
                      <div className="flex items-start">
                        <Image
                          src={item.userAva}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col mt-1 gap-[2px]">
                        <SegmentMess key={item.userId} segments={item} />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col w-[50%] justify-end items-end">
                <div className="flex flex-col mt-1 gap-[2px] items-end">
                  {segmentsGroup
                    .filter(
                      (group) => group.groupId === id && group.userId === "001"
                    )
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
            <div className="flex background-light850_dark200 flex-grow scrollable overflow-scroll pl-4 w-[36%] h-full">
              {renderComponent()}
            </div>
          ) : (
            <div className="flex background-light850_dark200 flex-grow scrollable overflow-scroll pl-4 w-[36%]">
              <MoreActions
                setActiveComponent={setActiveComponent}
                setItemSent={setItemSent}
                itemSent={itemSent}
              />
            </div>
          )
        ) : null}
      </div>
    )
  );
};

export default RightGroup;
