"use client";
import { PersonalItemProps } from "@/types/settings";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import PersonalEdit from "./PersonalEdit";

const PersonalFirst = ({ personal, setEdit }: PersonalItemProps) => {
  const user = personal;
  const handleEdit = () => {
    setEdit(true);
  };
  return (
    <>
      <div className="w-full h-fit relative px-4">
        {/* Background */}
        {user.background === "" ? (
          <div className="absolute top-0 left-0 w-full h-[129px] background-light500_dark400 z-0"></div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-[129px] z-0">
            <Image
              src={user.background}
              alt="background"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}

        <div className="w-full flex items-end justify-start relative z-10 h-fit">
          {/* Avatar */}
          <div className="mt-[112px] h-fit w-fit">
            <Image
              src={user.ava !== "" ? user.ava : "/assets/ava/default.png"}
              alt="ava"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>

          {/* Name and Buttons */}
          <div className="flex w-full items-center ml-3 mb-3 h-full">
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex flex-row w-fit items-start justify-start">
                <p className="text-dark100_light900 paragraph-regular">
                  {user.name}
                </p>
                <Button
                  className="flex w-fit h-fit py-0 bg-transparent border-none shadow-none"
                  onClick={handleEdit}
                >
                  <Icon
                    icon="iconamoon:edit"
                    width={20}
                    height={20}
                    className="text-primary-500"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalFirst;
