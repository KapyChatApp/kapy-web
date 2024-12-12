"use client";
import { PersonalItemProps } from "@/types/settings";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import PersonalEdit from "./PersonalEdit";
import PersonalUpdateAva from "./PersonalUpdateAva";
import PersonalUpdateBg from "./PersonalUpdateBg";
import AvatarEditor from "react-avatar-editor";
import { useUserContext } from "@/context/UserContext";
import { Fancybox } from "@fancyapps/ui";

const PersonalFirst = ({ personal, setEdit }: PersonalItemProps) => {
  const user = personal;
  const [updateAva, setUpdateAva] = useState(false);
  const [updateBackground, setUpdateBackground] = useState(false);
  const [newBackground, setNewBackground] = useState("");
  const { newAva } = useUserContext();
  const editorRef = useRef<AvatarEditor | null>(null);

  const handleEdit = () => {
    setEdit(true);
  };
  const handleUpdateAva = () => {
    setUpdateAva(true);
  };
  const handleUpdateBackground = () => {
    setUpdateBackground(true);
  };

  //Show ava
  useEffect(() => {
    // Khởi tạo Fancybox sau khi DOM đã sẵn sàng
    Fancybox.bind("[data-fancybox='ava']", {
      Toolbar: true,
      Thumbs: true
    });
    return () => {
      Fancybox.destroy(); // Hủy Fancybox khi component unmount
    };
  }, []);
  //Show background
  useEffect(() => {
    // Khởi tạo Fancybox sau khi DOM đã sẵn sàng
    Fancybox.bind("[data-fancybox='background']", {
      Toolbar: true,
      Thumbs: true
    });
    return () => {
      Fancybox.destroy(); // Hủy Fancybox khi component unmount
    };
  }, []);
  return (
    <>
      <div className="w-full h-[184px] relative px-4">
        {/* Background */}
        {newBackground || user.background ? (
          <div className="absolute top-0 left-0 w-full h-[129px] ">
            <div className="relative w-full h-[129px] z-10">
              <a
                href={newBackground ? newBackground : user.background}
                data-fancybox="background"
                className={` max-w-full h-auto cursor-pointer `}
              >
                <Image
                  src={newBackground ? newBackground : user.background}
                  alt="background"
                  layout="fill"
                  objectFit="cover"
                />
              </a>
              {/* Div chứa icon camera */}
              <div
                className="absolute bottom-2 right-2 p-2 background-light800_dark500 rounded-full shadow-lg cursor-pointer"
                onClick={handleUpdateBackground}
              >
                <Icon
                  icon="ic:outline-camera-alt"
                  width={24}
                  height={24}
                  className="text-dark300_light800"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-[129px] background-light500_dark400 z-10">
            {/* Div chứa icon camera */}
            <div
              className="absolute bottom-2 right-2 p-2 background-light800_dark500 rounded-full shadow-lg cursor-pointer"
              onClick={handleUpdateBackground}
            >
              <div className="flex w-fit h-fit cursor-pointer">
                <Icon
                  icon="ic:outline-camera-alt"
                  width={24}
                  height={24}
                  className="text-dark300_light800 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        <div className="w-fit flex items-end justify-start relative h-[184px]">
          {/* Avatar */}
          <div className="absolute top-[100px] h-auto w-fit cursor-pointer z-10">
            <a
              href={
                user.avatar !== ""
                  ? newAva
                    ? newAva
                    : user.avatar
                  : "/assets/ava/default.png"
              }
              data-fancybox="ava"
              className={` max-w-full h-auto cursor-pointer `}
            >
              <Image
                src={
                  user.avatar !== ""
                    ? newAva
                      ? newAva
                      : user.avatar
                    : "/assets/ava/default.png"
                }
                alt="ava"
                width={80}
                height={80}
                className="rounded-full"
                objectFit="cover"
              />
            </a>
            <div
              className="absolute bottom-0 right-0 p-[6px] background-light800_dark500 rounded-full shadow-lg"
              onClick={handleUpdateAva}
            >
              <Icon
                icon="ic:outline-camera-alt"
                width={14}
                height={14}
                className="text-dark300_light800"
              />
            </div>
          </div>

          {/* Name and Buttons */}
          <div className="flex relative w-full items-ends ml-[90px] mb-3 h-full">
            <div className="flex flex-row w-full items-end justify-end">
              <div className="flex flex-row w-fit items-start justify-start">
                <p className="text-dark100_light900 paragraph-regular">
                  {user.firstName + " " + user.lastName}
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

      {updateAva && (
        <PersonalUpdateAva setUpdateAva={setUpdateAva} editorRef={editorRef} />
      )}
      {updateBackground && (
        <PersonalUpdateBg
          setUpdateBackground={setUpdateBackground}
          setNewBackground={setNewBackground}
          editorRef={editorRef}
        />
      )}
    </>
  );
};

export default PersonalFirst;
