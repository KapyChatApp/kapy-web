"use client";
import { useUserContext } from "@/context/UserContext";
import { AccountData } from "@/types/account";
import React from "react";
import PostGrid from "./PostGrid";
import MediaGrid from "./MediaGrid";

const TabContent = ({
  account,
  activeTab
}: {
  account: AccountData;
  activeTab: string;
}) => {
  const { postData } = useUserContext();
  if (!postData) {
    return (
      <div className="flex h-full w-full items-center justify-center background-light900_dark400">
        <div className="loader"></div>
      </div>
    );
  }
  const isBff = account.type === "friend" && account.data.relation === "bff";
  const allImages = postData
    .flatMap((post) => post.contents)
    .filter((content) => content.type === "Image");
  const allReels = postData
    .flatMap((post) => post.contents)
    .filter((content) => content.type === "Video");

  const renderGrid = () => {
    switch (activeTab) {
      case "post":
        return <PostGrid postData={postData} />;
      case "photo":
        return <MediaGrid mediaList={allImages} isPhoto={true} />;
      default:
        return <MediaGrid mediaList={allReels} isPhoto={false} />;
    }
  };
  return isBff ? (
    <div className="flex-1 h-auto pb-5">{renderGrid()}</div>
  ) : (
    <div className="flex w-full h-full items-center justify-center pb-5">
      <span className="text-dark100_light900 paragraph-bold">
        Just be a best friend to see their posts
      </span>
    </div>
  );
};

export default TabContent;
