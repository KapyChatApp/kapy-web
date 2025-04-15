"use client";
import { AccountData } from "@/types/account";
import Image from "next/image";
import React, { useRef, useState } from "react";
import PersonalUpdateAva from "../settings/Profile/PersonalUpdateAva";
import AvatarEditor from "react-avatar-editor";
import { useUserContext } from "@/context/UserContext";

const AvatarHeader = ({ account }: { account: AccountData }) => {
  const { newAva, adminInfo } = useUserContext();
  const [updateAva, setUpdateAva] = useState(false);
  const editorRef = useRef<AvatarEditor | null>(null);
  return (
    <>
      <section className="flex row-span-4 mr-7 items-center justify-center">
        <div
          className="rounded-full w-40 h-40 max-w-[160px] relative overflow-hidden cursor-pointer"
          onClick={() => setUpdateAva(true)}
        >
          <Image
            alt="ava"
            src={
              "mutualFriends" in account.data
                ? account.data.avatar
                  ? account.data.avatar
                  : "/assets/ava/default.png"
                : newAva
                ? newAva
                : adminInfo.avatar
                ? adminInfo.avatar
                : "/assets/ava/default.png"
            }
            fill
            className="object-cover"
          />
        </div>
      </section>

      {updateAva && (
        <PersonalUpdateAva setUpdateAva={setUpdateAva} editorRef={editorRef} />
      )}
    </>
  );
};

export default AvatarHeader;
