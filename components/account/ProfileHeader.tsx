"use client";
import { AccountData } from "@/types/account";
import React, { useState } from "react";
import AvatarHeader from "./AvatarHeader";
import ButtonHeader from "./ButtonHeader";
import DetailListUser from "../shared/modal/DetailListUser";
import { useUserContext } from "@/context/UserContext";

const ProfileHeader = ({ account }: { account: AccountData }) => {
  const [renderMutual, setRenderMutual] = useState(false);
  const { postData } = useUserContext();
  return (
    <>
      <header className="grid grid-cols-[1fr_2fr] items-start justify-center w-full">
        {/* Section 1: Avatar */}
        <AvatarHeader account={account} />

        {/* Section 2: Tên + Follow + Message */}
        <ButtonHeader account={account} />

        {/* Section 3: Thống kê */}
        <section className="row-start-2 col-start-2 flex gap-6 mb-5">
          {/* Mutual friends */}
          {account.type === "friend" && (
            <span
              className="flex gap-2 items-center justify-center cursor-pointer"
              onClick={() => setRenderMutual(true)}
            >
              <span className="paragraph-semibold text-dark100_light900">
                {account.data.mutualFriends.length}
              </span>
              <span className="paragraph-regular text-dark600_light600">
                muatual friends
              </span>
            </span>
          )}

          {/* Posts */}
          <span className="flex gap-2 items-center justify-center">
            <span className="paragraph-semibold text-dark100_light900">
              {account.type === "friend"
                ? postData
                  ? postData.length
                  : 0
                : account.data.postIds.length}
            </span>
            <span className="paragraph-regular text-dark600_light600">
              posts
            </span>
          </span>

          {/* Point */}
          <span className="flex gap-2 items-center justify-center">
            <span className="paragraph-semibold text-dark100_light900">
              {account.data.point}
            </span>
            <span className="paragraph-regular text-dark600_light600">
              points
            </span>
          </span>
        </section>

        {/* Section 4: Bio + Nickname */}
        <section className="row-start-3 col-start-2 flex flex-col">
          <span className="text-dark100_light900 paragraph-15-light">
            {account.type === "friend" ? account.data.bio : account.data.bio}
          </span>
          <span className="text-accent-blue body-light italic mt-[2px]">
            @
            {account.type === "friend"
              ? account.data.nickName
              : account.data.nickName}
          </span>
        </section>
      </header>

      {renderMutual && account.type === "friend" && (
        <DetailListUser
          list={account.data.mutualFriends}
          setIsBack={setRenderMutual}
          label="Muatual friends"
        />
      )}
    </>
  );
};

export default ProfileHeader;
