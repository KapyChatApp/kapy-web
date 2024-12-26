"use client";
import React, { useEffect, useState } from "react";
import FindComponent from "./MoreActions/FindComponent";
import ManagementComponent from "./MoreActions/ManagementComponent";
import AddComponent from "./MoreActions/AddComponent";
import MoreActions from "./MoreActions/MoreActions";
import SeeAllMember from "./MoreActions/SeeAll/SeeAllMember";
import SeeAllFile from "./MoreActions/SeeAll/SeeAllFile";
import SeeAllPhoto from "./MoreActions/SeeAll/SeeAllPhoto";
import SeeAllVideo from "./MoreActions/SeeAll/SeeAllVideo";
import { FileContent, MessageBoxInfo, UserInfoBox } from "@/lib/DTO/message";
import { useLayoutContext } from "@/context/LayoutContext";
import { useChatContext } from "@/context/ChatContext";

interface OpenMoreDisplayProps {
  detailByBox: MessageBoxInfo | undefined;
  setRelation: React.Dispatch<React.SetStateAction<string>>;
  relation: string;
}
interface MoreDisplay {
  display: OpenMoreDisplayProps;
}

const OpenMoreDisplay = ({ display }: MoreDisplay) => {
  const { detailByBox, setRelation, relation } = display;
  const { openMore } = useLayoutContext();
  const { setMemberList } = useChatContext();
  let detail: MessageBoxInfo = {
    id: "",
    receiverInfo: {
      _id: "",
      firstName: "",
      lastName: "",
      nickName: "",
      avatar: "",
      isOnline: false
    },
    memberInfo: [
      {
        _id: "",
        firstName: "",
        lastName: "",
        nickName: "",
        avatar: "",
        isOnline: false
      }
    ],
    groupName: "",
    groupAva: "",
    pin: false,
    stranger: false,
    readStatus: false,
    readedId: [],
    createBy: ""
  };
  if (detailByBox) {
    detail = detailByBox;
    setMemberList(detail.memberInfo);
  }
  const [activeComponent, setActiveComponent] = useState<string>("");
  const [itemSent, setItemSent] = useState([] as UserInfoBox[] | FileContent[]);

  const propsAll = {
    detailByBox: detail,
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
        return (
          <ManagementComponent
            setActiveComponent={setActiveComponent}
            box={detail}
          />
        );
      case "add":
        return (
          <>
            <AddComponent
              setActiveComponent={setActiveComponent}
              box={detail}
            />
            <MoreActions
              propsAll={propsAll}
              relation={relation}
              setRelation={setRelation}
            />
          </>
        );
      case "member":
        return (
          <SeeAllMember
            detailByBox={detail}
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
      case "file":
        return (
          <SeeAllFile
            detailByBox={detail}
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
      case "photo":
        return (
          <SeeAllPhoto
            detailByBox={detail}
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
      case "video":
        return (
          <SeeAllVideo
            detailByBox={detail}
            setActiveComponent={setActiveComponent}
            setItemSent={setItemSent}
            itemSent={itemSent}
          />
        );
      default:
        return (
          <MoreActions
            propsAll={propsAll}
            relation={relation}
            setRelation={setRelation}
          />
        );
    }
  };
  return (
    openMore &&
    (activeComponent ? (
      <div
        className={`flex background-light850_dark200 flex-grow scrollable overflow-scroll pl-4 w-[20%] h-full`}
      >
        {renderComponent()}
      </div>
    ) : (
      <div className="flex background-light850_dark200 flex-grow scrollable overflow-scroll pl-4 w-[20%] h-full">
        <MoreActions
          propsAll={propsAll}
          relation={relation}
          setRelation={setRelation}
        />
      </div>
    ))
  );
};

export default OpenMoreDisplay;
