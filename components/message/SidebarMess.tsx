"use client";
import Image from "next/image";
import React, { useState } from "react";
import { file, link, photo, sidebarMess, video } from "@/constants";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import RightsideButton from "../shared/button/RightsideButton";
import { Button } from "../ui/button";

const SidebarMess = () => {
  // Quản lý trạng thái cho icon và label
  const [isNotified, setIsNotified] = useState(false);
  const [isFind, setIsFind] = useState(false);
  const [isBest, setIsBest] = useState(false);
  const [isBlock, setIsBlock] = useState(false);

  const handleNotificationClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setIsNotified(!isNotified);
  };
  const handleFindClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setIsFind(!isFind);
  };
  const handleBlockClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setIsBlock(!isBlock);
  };
  const handleBestClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setIsBest(!isBest);
  };
  return (
    <div className="flex flex-col w-full h-fit items-center justify-center">
      <div className="flex flex-col flex-1 items-center justify-center w-full h-fit gap-[12px]">
        <div className="flex flex-col items-center justify-center w-full h-fit gap-[12px]">
          <Image
            src="/assets/ava/ava1.jpg"
            alt="ava"
            width={80}
            height={80}
            className="rounded-full"
          />
          <p className="paragraph-regular text-dark100_light900">Junnie</p>
        </div>
        <div className="flex items-center justify-between w-full h-fit">
          {sidebarMess.map((item) => {
            let icon = item.icon;
            let label = item.label;
            let onClick = item.onClick;
            let isBestButton = false;
            let isBlockButton = false;
            switch (item.label) {
              case "Notification":
                icon = isNotified
                  ? "clarity:notification-solid"
                  : "mingcute:notification-off-fill";
                label = isNotified ? "Turn off" : "Turn on";
                onClick = handleNotificationClick;
                break;
              case "Find":
                onClick = handleFindClick;
                break;
              case "Best friend":
                label = isBest ? "Not best" : "Best friend";
                onClick = handleBestClick;
                isBestButton = isBest;
                break;
              case "Block":
                label = isBlock ? "Unblock" : "Block";
                isBlockButton = isBlock;
                onClick = handleBlockClick;
                break;
              default:
                break;
            }
            return (
              <RightsideButton
                key={item.icon}
                icon={icon}
                label={label}
                onClick={onClick}
                isBest={isBestButton}
                isBlock={isBlockButton}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col flex-1 items-center justify-center w-full h-fit gap-[18px] mt-[24px] mb-[24px]">
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-center">
              <p className="text-dark100_light900 paragraph-bold">Photo</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom ml-[8px]">
                {photo.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Link
                href="/"
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
              >
                See all
              </Link>
            </div>
          </div>
          <div className="flex flex-row items-center w-full justify-between">
            {photo.length > 0
              ? photo.slice(0, 3).map((item) => (
                  <div className="flex w-[26%] relative">
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
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-center">
              <p className="text-dark100_light900 paragraph-bold">Video</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom ml-[8px]">
                {video.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Link
                href="/"
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
              >
                See all
              </Link>
            </div>
          </div>
          <div className="flex flex-row items-center w-full justify-between">
            {video.length > 0
              ? video.slice(0, 3).map((item) => (
                  <div className="flex w-[26%] relative">
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
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-center">
              <p className="text-dark100_light900 paragraph-bold">File</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom ml-[8px]">
                {file.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Link
                href="/"
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
              >
                See all
              </Link>
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
                        className="flex flex-grow items-center justify-start text-dark100_light900paragraph-regular "
                      >
                        {item.fileName}
                      </Link>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-center">
              <p className="text-dark100_light900 paragraph-bold">Link</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom ml-[8px]">
                {link.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Link
                href="/"
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
              >
                See all
              </Link>
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
                        className="flex flex-grow items-center justify-start text-dark100_light900paragraph-regular "
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
      <div className="flex flex-col items-center justify-center gap-[8px] w-full mt-auto">
        <div className="flex items-center justify-center gap-[8px] w-full rounded-lg bg-light-700 dark:bg-dark-400 dark:bg-opacity-80">
          <Button className="shadow-none border-none flex items-center justify-center w-full bg-transparent">
            <p className="text-dark100_light900  paragraph-semibold">Remove</p>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-[8px] w-full rounded-lg bg-accent-red bg-opacity-20">
          <Button className="shadow-none border-none flex items-center justify-center w-full bg-transparent">
            <p className="text-accent-red paragraph-semibold">Unfriend</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarMess;