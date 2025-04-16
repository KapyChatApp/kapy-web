"use client";
import { AccountData } from "@/types/account";
import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent";
import { PostResponseDTO } from "@/lib/DTO/post";

const AccountLayout = ({ account }: { account: AccountData }) => {
  const [activeTab, setActiveTab] = useState("post");

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mx-[108px] pt-[30px] px-5">
      <ProfileHeader account={account} />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContent account={account} activeTab={activeTab} />
    </div>
  );
};

export default AccountLayout;
