import { AccountData } from "@/types/account";
import React from "react";
import ProfileHeader from "./ProfileHeader";

const AccountLayout = ({ account }: { account: AccountData }) => {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full mx-[108px] pt-[30px] px-5">
      <ProfileHeader account={account} />
      <div>Tab navigation</div>
      <div>Posts</div>
    </div>
  );
};

export default AccountLayout;
