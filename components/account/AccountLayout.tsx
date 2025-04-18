"use client";
import { AccountData } from "@/types/account";
import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent";

const AccountLayout = ({ account }: { account: AccountData | null }) => {
  const [activeTab, setActiveTab] = useState("post");

  if (!account)
    return (
      <div className="flex h-screen w-screen items-center justify-center background-light900_dark400">
        <div className="loader"></div>
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-start w-full h-full mx-[108px] pt-[30px] px-5">
      <ProfileHeader account={account} />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContent account={account} activeTab={activeTab} />
    </div>
  );
};

export default AccountLayout;
