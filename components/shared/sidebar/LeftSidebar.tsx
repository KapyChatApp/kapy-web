"use client";
import React, { useState } from "react";
import { sidebarLinks } from "@/constants/index";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from "@radix-ui/react-menubar";

const Leftsidebar = () => {
  const [isParagraphVisible, setIsParagraphVisible] = useState(true); // Bước 1: Tạo state

  const toggleParagraphVisibility = () => {
    setIsParagraphVisible(!isParagraphVisible); // Bước 2: Cập nhật state khi nhấn nút
  };

  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Hàm xử lý khi nút "Vietnamese" được nhấn
  const handleButtonVietNamClick = () => {
    setSelectedLanguage("vietnamese"); // Đặt trạng thái là "vietnamese"
  };

  // Hàm xử lý khi nút "English" được nhấn
  const handleButtonEnglishClick = () => {
    setSelectedLanguage("english"); // Đặt trạng thái là "english"
  };

  const [isMenubarOpen, setIsMenubarOpen] = useState(false);

  // Toggle trạng thái menubar
  const toggleMenubar = () => {
    setIsMenubarOpen(!isMenubarOpen);
  };

  const pathname = usePathname();
  return (
    <section
      className={`background-light850_dark200 flex h-screen flex-col justify-center overflow-hidden border-none p-[16px] ${
        isParagraphVisible ? "w-auto" : "w-fit"
      }`}
    >
      <div
        className={`flex-1 ${
          isParagraphVisible ? "w-auto" : "w-fit items-center justify-center"
        }`}
      >
        <div
          className={`flex flex-col ${
            isParagraphVisible ? "w-auto" : "w-full items-center justify-center"
          }`}
        >
          <Link
            key="logo"
            href="/"
            className={`text-dark100_light900 flex items-center justify-center bg-transparent gap-[18px] ${
              isParagraphVisible ? "w-auto" : "w-fit"
            }`}
          >
            <Image
              src="/assets/images/icon.png"
              alt="logo"
              width={32}
              height={32}
            />
            {isParagraphVisible && (
              <p className="h2-bold max-sm:hidden">KAPY ChatApp</p>
            )}
          </Link>
        </div>
        <div
          className={`flex flex-col mt-[32px] ${
            isParagraphVisible ? "w-auto" : "w-fit items-center justify-center"
          }`}
        >
          {sidebarLinks.map((item) => {
            console.log("Current pathname:", pathname);
            console.log("Current item route:", item.route);
            const isActive =
              (pathname.includes(item.route) && item.route.length > 1) ||
              pathname === item.route;
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`${
                  isActive
                    ? "bg-light-700 dark:bg-dark-400 dark:bg-opacity-80 rounded-lg w-auto h-[44px] text-dark100_light900"
                    : "text-dark100_light900 bg-transparent"
                } flex items-center justify-start hover:bg-light-700 hover:dark:bg-dark-400 hover:dark:bg-opacity-80 hover:rounded-lg`}
              >
                <div className="bg-transparent flex items-center justify-start p-[12px]">
                  <Icon
                    icon={item.icon}
                    width={18}
                    height={18}
                    className="text-light900_dark100"
                  />
                  {isParagraphVisible && (
                    <p className="paragraph-regular ml-[12px]">{item.label}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className={`mt-auto ${
          isParagraphVisible
            ? "flex flex-row w-full"
            : "flex flex-col w-full gap-[12px] items-center justify-center"
        }`}
      >
        <div className={`flex z-10 ${isParagraphVisible ? "w-full" : "w-fit"}`}>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`shadow-none border-custom ${
                isParagraphVisible
                  ? "w-full flex bg-light-700 dark:bg-dark-400 rounded-lg text-light900_dark100 h-[32px] px-3 py-[4px] items-center justify-start dark:bg-opacity-80"
                  : "w-fit bg-transparent justify-center p-0"
              }`}
            >
              <div className="flex w-full">
                <Image
                  src="/assets/images/icon.png"
                  alt="logo"
                  width={24}
                  height={24}
                />
                {isParagraphVisible && (
                  <div className="flex w-full justify-start items-center">
                    <p className="paragraph-regular ml-[12px] ">Junie</p>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mb-[8px] ml-[28px] min-w-[344px] rounded-lg shadow-lg p-1 dark:bg-dark-200 bg-light-900 gap-2">
              <DropdownMenuLabel className="hover:bg-light-700 hover:rounded-lg hover:dark:bg-dark-400 hover:dark:bg-opacity-80">
                <Link
                  key="account"
                  href="/account"
                  className="text-dark100_light900 flex flex-1 items-center justify-start bg-transparent w-full"
                >
                  <div className="flex flex-row p-[8px] gap-[12px]">
                    <Icon
                      icon="tabler:user-filled"
                      width={18}
                      height={18}
                      className="text-light900_dark100"
                    />

                    <p className="paragraph-regular">My account</p>
                  </div>
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuLabel className="hover:bg-light-700 hover:rounded-lg hover:dark:bg-dark-400 hover:dark:bg-opacity-80">
                <Link
                  key="setting"
                  href="/setting"
                  className="text-dark100_light900 flex flex-1 items-center justify-start bg-transparent w-full"
                >
                  <div className="flex flex-row p-[8px] gap-[12px]">
                    <Icon
                      icon="lets-icons:setting-fill"
                      width={18}
                      height={18}
                      className="text-light900_dark100"
                    />

                    <p className="paragraph-regular">Setting</p>
                  </div>
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="w-full bg-transparent h-fit py-1">
                <div className="w-full h-[1px] bg-light-500 dark:bg-dark-400"></div>
              </DropdownMenuSeparator>
              <DropdownMenuLabel className="hover:bg-light-700 hover:rounded-lg hover:dark:bg-dark-400 hover:dark:bg-opacity-80">
                <div className="w-full flex relative">
                  <Menubar className="w-full flex">
                    <MenubarMenu>
                      <MenubarTrigger
                        className="shadow-none border-none flex flex-1 items-center justify-between bg-transparent w-full"
                        onClick={toggleMenubar}
                      >
                        <div className="flex flex-row p-[8px] gap-[12px]">
                          <Icon
                            icon="ic:baseline-language"
                            width={18}
                            height={18}
                            className="text-light900_dark100"
                          />

                          <p className="paragraph-regular">Language</p>
                        </div>
                        <Icon
                          icon="grommet-icons:next"
                          width={18}
                          height={18}
                          className="background-light900_dark100"
                        />
                      </MenubarTrigger>
                      {isMenubarOpen && (
                        <MenubarContent
                          side="right"
                          className="hover:boder-none ml-[13px] min-w-[218px] rounded-lg shadow-lg p-1 dark:bg-dark-200 bg-light-900 gap-2 justify-start items-center"
                        >
                          <MenubarItem className="hover:bg-light-700 hover:rounded-lg hover:border-none">
                            <Button
                              className="flex flex-row p-[8px] border-none shadow-none w-full justify-between items-center hover:border-none"
                              onClick={handleButtonVietNamClick}
                            >
                              <div className="flex gap-[12px] justify-start items-center w-fit">
                                <Icon
                                  icon="twemoji:flag-vietnam"
                                  width={18}
                                  height={18}
                                  className="justify-start w-fit"
                                />

                                <p className="paragraph-regular">Vietnamese</p>
                              </div>
                              {selectedLanguage === "vietnamese" && (
                                <Icon
                                  icon="mdi:tick"
                                  width={18}
                                  height={18}
                                  className="text-primary-500"
                                />
                              )}
                            </Button>
                          </MenubarItem>
                          <MenubarSeparator className="w-full bg-transparent h-fit py-1">
                            <div className="w-full h-[1px] bg-light-500 dark:bg-dark-400"></div>
                          </MenubarSeparator>
                          <MenubarItem className="hover:bg-light-700 hover:rounded-lg hover:border-none">
                            <Button
                              className="flex flex-row p-[8px] border-none shadow-none w-full justify-between items-center hover:border-none"
                              onClick={handleButtonEnglishClick}
                            >
                              <div className="flex gap-[12px] justify-start items-center w-fit">
                                <Icon
                                  icon="twemoji:flag-liberia"
                                  width={18}
                                  height={18}
                                  className="justify-start w-fit"
                                />

                                <p className="paragraph-regular">English</p>
                              </div>
                              {selectedLanguage === "english" && (
                                <Icon
                                  icon="mdi:tick"
                                  width={18}
                                  height={18}
                                  className="text-primary-500"
                                />
                              )}
                            </Button>
                          </MenubarItem>
                        </MenubarContent>
                      )}
                    </MenubarMenu>
                  </Menubar>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="w-full bg-transparent h-fit py-1">
                <div className="w-full h-[1px] bg-light-500 dark:bg-dark-400"></div>
              </DropdownMenuSeparator>
              <DropdownMenuLabel className="hover:bg-light-700 hover:dark:bg-dark-400 hover:dark:bg-opacity-80 hover:rounded-lg">
                <Link
                  key="logout"
                  href="/signin"
                  className="text-dark100_light900 flex flex-1 items-center justify-start bg-transparent w-full"
                >
                  <div className="flex flex-row p-[8px] gap-[12px]">
                    <Icon
                      icon="material-symbols:logout"
                      width={18}
                      height={18}
                      className="text-accent-red"
                    />

                    <p className="paragraph-regular text-accent-red">Log out</p>
                  </div>
                </Link>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={`flex ${isParagraphVisible ? "ml-[12px]" : ""}`}>
          <Button
            className="flex rounded-full background-light700_dark400 h-[32px] w-[32px] justify-center items-center"
            onClick={toggleParagraphVisibility}
          >
            <div className="flex items-end justify-center">
              <Icon
                icon="zondicons:show-sidebar"
                width={14}
                height={14}
                className="text-light900_dark100"
              />
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Leftsidebar;
