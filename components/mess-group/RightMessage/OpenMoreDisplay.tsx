"use client";
import React, { useEffect, useState } from "react";
import FindComponent from "../MoreActions/FindComponent";
import ManagementComponent from "../MoreActions/ManagementComponent";
import AddComponent from "../MoreActions/AddComponent";
import MoreActions from "../MoreActions/MoreActions";
import SeeAllMember from "../MoreActions/SeeAll/SeeAllMember";
import SeeAllFile from "../MoreActions/SeeAll/SeeAllFile";
import SeeAllPhoto from "../MoreActions/SeeAll/SeeAllPhoto";
import SeeAllLink from "../MoreActions/SeeAll/SeeAllLink";
import SeeAllVideo from "../MoreActions/SeeAll/SeeAllVideo";
import { MememberGroup } from "@/types/object";
import { Files, Links, Photo, Video } from "@/types/media";
import { SeeAllProps, StateType } from "@/types/mess-group";

interface OpenMoreDisplayProps {
  openMore: boolean;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
  isClickOtherRight?: boolean;
  setClickOtherRight?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MoreDisplay {
  display: OpenMoreDisplayProps;
}

const OpenMoreDisplay = ({ display }: MoreDisplay) => {
  const { openMore, setOpenMore, isClickOtherRight, setClickOtherRight } =
    display;

  const [activeComponent, setActiveComponent] = useState<string>("");
  const [itemSent, setItemSent] = useState(
    [] as MememberGroup[] | Photo[] | Video[] | Files[] | Links[]
  );

  const propsAll: SeeAllProps = {
    setActiveComponent: setActiveComponent,
    setItemSent: setItemSent,
    itemSent: itemSent
  };

  //RENDER MORE WHEN OPEN
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
            <MoreActions propsAll={propsAll} setOpenMore={setOpenMore} />
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
        return <MoreActions propsAll={propsAll} setOpenMore={setOpenMore} />;
    }
  };
  return isClickOtherRight ? (
    openMore ? (
      activeComponent ? (
        <div className="flex background-light850_dark200 flex-grow scrollable overflow-scroll pl-4 w-full h-full">
          {renderComponent()}
        </div>
      ) : (
        <div className="flex background-light850_dark200 flex-grow scrollable overflow-scroll pl-4 w-full">
          <MoreActions
            propsAll={propsAll}
            setOpenMore={setOpenMore}
            setClickOtherRight={setClickOtherRight}
          />
        </div>
      )
    ) : null
  ) : openMore ? (
    activeComponent ? (
      <div
        className={`md:flex hidden background-light850_dark200 flex-grow scrollable overflow-scroll pl-4 lg:w-[30%] md:w-[50%] w-[40%] h-full`}
      >
        {renderComponent()}
      </div>
    ) : (
      <div className="md:flex hidden background-light850_dark200 flex-grow scrollable overflow-scroll pl-4 lg:w-[30%] md:w-[50%] w-[40%] h-full">
        <MoreActions
          propsAll={propsAll}
          openMore={openMore}
          setOpenMore={setOpenMore}
        />
      </div>
    )
  ) : null;
};

export default OpenMoreDisplay;
