"use client";
import { AccountData } from "@/types/account";
import Image from "next/image";
import React, { useRef, useState } from "react";
import PersonalUpdateAva from "../settings/Profile/PersonalUpdateAva";
import AvatarEditor from "react-avatar-editor";
import { useUserContext } from "@/context/UserContext";
import { useParams } from "next/navigation";

const AvatarHeader = ({ account }: { account: AccountData }) => {
  const { id } = useParams();
  const { newAva, adminInfo } = useUserContext();
  const [updateAva, setUpdateAva] = useState(false);
  const editorRef = useRef<AvatarEditor | null>(null);
  return (
    <>
      <section className="flex row-span-4 mr-7 items-center justify-center">
        <div
          className={`rounded-full w-40 h-40 max-w-[160px] relative overflow-hidden ${
            adminInfo._id === id.toString() && "cursor-pointer"
          }`}
          onClick={() => id.toString() === adminInfo._id && setUpdateAva(true)}
        >
          <Image
            alt="ava"
            src={
              newAva
                ? newAva
                : account.data.avatar
                ? account.data.avatar
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
