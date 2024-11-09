"use client";
import { group } from "@/constants/object";
import { file, link, photo, video } from "@/constants/media";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SeeAllProps } from "@/types/mess-group";

const MoreMiddle = ({ setActiveComponent, setItemSent }: SeeAllProps) => {
  const pathname = usePathname();
  const isGroup = /^\/group-chat\/\d+$/.test(pathname);
  const idFromPathname = pathname.split("/").pop();
  const groupInfo = group.filter((info) => info.id === idFromPathname);

  const handleSeeAllMember = () => {
    setActiveComponent("member");
    setItemSent(groupInfo[0].members);
  };
  const handleSeeAllPhoto = () => {
    setActiveComponent("photo");
    setItemSent(photo);
  };
  const handleSeeAllVideo = () => {
    setActiveComponent("video");
    setItemSent(video);
  };
  const handleSeeAllFile = () => {
    setActiveComponent("file");
    setItemSent(file);
  };
  const handleSeeAllLink = () => {
    setActiveComponent("link");
    setItemSent(link);
  };

  return (
    <>
      <div className="flex flex-col flex-1 items-center justify-center w-full h-fit gap-[18px] mt-[24px] mb-[24px] responsive-moreAction">
        {/* Members */}
        {isGroup && (
          <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
            <div className="flex flex-row items-center justify-start w-full">
              <div className="flex flex-row w-fit items-end">
                <p className="text-dark100_light900 paragraph-bold">Members</p>
                <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 body-light ml-[8px]">
                  {groupInfo[0].members.length}
                </p>
              </div>
              <div className="flex flex-grow items-center justify-end">
                <Button
                  className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
                  onClick={handleSeeAllMember}
                >
                  See all
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center w-full gap-[8px]">
              {groupInfo[0].members.length > 0
                ? // Sắp xếp members để leader đứng đầu
                  groupInfo[0].members
                    .sort((a, b) => (a.addedBy === "" ? -1 : 1)) // Sắp xếp người lãnh đạo lên đầu
                    .slice(0, 3) // Lấy tối đa 3 người
                    .map((item) => (
                      <div
                        className="flex flex-row items-center justify-start w-full gap-[12px]"
                        key={item.id}
                      >
                        <div className="relative flex-shrink-0 w-fit">
                          <Image
                            src={item.ava}
                            alt="ava"
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                          {item.isOnline && (
                            <div className="bg-green-600 rounded-full w-[8px] h-[8px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
                          )}
                        </div>

                        <div className="flex flex-col bg-transparent items-start justify-start gap-[2px] flex-grow overflow-hidden min-w-0">
                          <p className="paragraph-15-regular h-fit text-dark100_light900">
                            {item.username}
                          </p>
                          <div className="flex items-center justify-start w-full min-w-0">
                            {item.addedBy === "" ? (
                              <p className="subtle-regular justify-start items-center text-primary-500 h-fit">
                                Leader
                              </p>
                            ) : (
                              <div className="flex items-center">
                                <p className="subtle-regular justify-start text-dark100_light900 h-fit">
                                  Added by
                                </p>
                                <p className="subtle-regular ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900 h-fit">
                                  {item.addedBy}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                : null}
            </div>
          </div>
        )}

        {/* Photo */}
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-end">
              <p className="text-dark100_light900 paragraph-bold">Photo</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 body-light ml-[8px]">
                {photo.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Button
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
                onClick={handleSeeAllPhoto}
              >
                See all
              </Button>
            </div>
          </div>
          <div className="flex flex-row items-center w-full md:justify-between justify-around">
            {photo.length > 0
              ? photo.slice(0, 3).map((item) => (
                  <div className="flex md:w-[26%] sm:w-[36%] w-[30%] relative">
                    <Image
                      src={item.path}
                      alt={item.fileName}
                      width={100}
                      height={100}
                      className="rounded-[4px] cursor-pointer"
                    />
                  </div>
                ))
              : null}
          </div>
        </div>

        {/* Video */}
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-end">
              <p className="text-dark100_light900 paragraph-bold">Video</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 body-light ml-[8px]">
                {video.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Button
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
                onClick={handleSeeAllVideo}
              >
                See all
              </Button>
            </div>
          </div>
          <div className="flex flex-row items-center w-full md:justify-between justify-around">
            {video.length > 0
              ? video.slice(0, 3).map((item) => (
                  <div className="flex md:w-[26%] sm:w-[36%] w-[30%] relative">
                    <Image
                      src={item.path}
                      alt={item.fileName}
                      width={100}
                      height={100}
                      className="rounded-[4px] cursor-pointer"
                    />
                  </div>
                ))
              : null}
          </div>
        </div>

        {/* File */}
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-end">
              <p className="text-dark100_light900 paragraph-bold">File</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 body-light ml-[8px]">
                {file.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Button
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
                onClick={handleSeeAllFile}
              >
                See all
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-start w-full gap-[12px]">
            {file.length > 0
              ? file.slice(0, 3).map((item) => {
                  let icon = item.icon;
                  let iconWord = "vscode-icons:file-type-word2";
                  let iconExcel = "vscode-icons:file-type-excel2";
                  let iconPpoint = "vscode-icons:file-type-powerpoint2";
                  let iconPdf = "vscode-icons:file-type-pdf2";
                  switch (item.type) {
                    case "word":
                      icon = iconWord;
                      break;
                    case "excel":
                      icon = iconExcel;
                      break;
                    case "powerpoint":
                      icon = iconPpoint;
                      break;
                    case "pdf":
                      icon = iconPdf;
                      break;
                    default:
                      icon = "flat-color-icons:file";
                  }
                  return (
                    <div className="flex flex-row relative gap-[12px] items-center justify-start">
                      <Icon icon={icon} width={20} height={20} className="" />
                      <Link
                        href={item.path}
                        className="flex flex-grow items-center justify-start text-dark100_light900 paragraph-regular "
                      >
                        {item.fileName}
                      </Link>
                    </div>
                  );
                })
              : null}
          </div>
        </div>

        {/* Link */}
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-end">
              <p className="text-dark100_light900 paragraph-bold">Link</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 body-light ml-[8px]">
                {link.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Button
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
                onClick={handleSeeAllLink}
              >
                See all
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-start w-full gap-[12px]">
            {link.length > 0
              ? link.slice(0, 3).map((item) => {
                  let icon = item.icon;
                  let iconDrive = "logos:google-drive";
                  switch (item.type) {
                    case "drive":
                      icon = iconDrive;
                      break;
                    default:
                      icon = "ph:link-bold";
                  }
                  return (
                    <div className="flex flex-row relative gap-[12px] items-center justify-start">
                      <Icon
                        icon={icon}
                        width={20}
                        height={20}
                        className={`${
                          item.type === " " ? "text-primary-500" : ""
                        }`}
                      />
                      <Link
                        href={item.path}
                        className="flex flex-grow items-center justify-start text-dark100_light900 paragraph-regular "
                      >
                        {item.linkName}
                      </Link>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreMiddle;
