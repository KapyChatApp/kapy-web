"use client";
import React, { useEffect, useState } from "react";
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
import { PersonalAccount } from "@/components/settings/Profile/PersonalAccount";
import SettingLayout from "@/components/settings/YourSetting/SettingLayout";
import { useUserContext } from "@/context/UserContext";
import { getMyProfile } from "@/lib/data/mine/dataAdmin";
import { getPusherClient } from "@/lib/pusher";
import { OnlineEvent } from "@/lib/DTO/user";
import { useChatContext } from "@/context/ChatContext";

const Leftsidebar = () => {
  const [isParagraphVisible, setIsParagraphVisible] = useState(true);
  const toggleParagraphVisibility = () => {
    setIsParagraphVisible(!isParagraphVisible);
  };

  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleButtonVietNamClick = () => {
    setSelectedLanguage("vietnamese");
  };

  const handleButtonEnglishClick = () => {
    setSelectedLanguage("english");
  };

  const [isMenubarOpen, setIsMenubarOpen] = useState(false);

  const toggleMenubar = () => {
    setIsMenubarOpen(!isMenubarOpen);
  };

  const pathname = usePathname();

  const [isAccount, setAccount] = useState(false);
  const [isSetting, setSetting] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { adminInfo, newAva, setAdminInfo } = useUserContext();

  const handleAccount = () => {
    setAccount(!isAccount);
    setDropdownOpen(false);
  };
  const handleSetting = () => {
    setSetting(!isSetting);
    setDropdownOpen(false);
  };
  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.BASE_URL}auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("adminId");
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 992) {
        setIsParagraphVisible(false);
      } else {
        setIsParagraphVisible(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      await getMyProfile(setAdminInfo);
    };
    getInfo();
  }, []);

  return (
    <>
      <section
        className={`background-light850_dark200 flex h-screen flex-col justify-center overflow-hidden border-none p-[16px] ${
          isParagraphVisible ? "w-[22%]" : "min-h-fit"
        }`}
      >
        <div className={`flex-1 w-full items-center justify-center`}>
          <div className={`flex flex-col w-full items-center justify-center `}>
            <Link
              key="logo"
              href="/"
              className={`text-dark100_light900 flex items-center ${
                isParagraphVisible ? "justify-start" : "justify-center"
              } bg-transparent gap-3 md:gap-1 w-full`}
            >
              <Image
                src="/assets/images/icon.png"
                alt="logo"
                width={34}
                height={34}
              />
              {isParagraphVisible && (
                <p className="max-sm:text-wrap h-fit chewy-regular xl:h2-bold h3-medium">
                  KAPY ChatApp
                </p>
              )}
            </Link>
          </div>
          <div
            className={`flex flex-col mt-[24px] ${
              isParagraphVisible
                ? "w-full"
                : "w-fit items-center justify-center"
            }`}
          >
            {sidebarLinks.map((item) => {
              const isDynamicPath = /^\/[a-zA-Z0-9_-]+$/.test(pathname);
              const isGroupDynamicPath = pathname.startsWith("/group-chat/");
              const isFriendDynamicPath = pathname.startsWith("/friends/");
              const isActive =
                pathname === item.route ||
                (isGroupDynamicPath && item.route === "/group-chat") ||
                (isFriendDynamicPath && item.route === "/friends") ||
                (/^\/[a-zA-Z0-9]{24}$/.test(pathname) && item.route === "/");
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  className={`${
                    isActive
                      ? "bg-light-700 dark:bg-dark-400 dark:bg-opacity-80 rounded-lg w-full h-[44px] text-dark100_light900"
                      : "text-dark100_light900 bg-transparent hover:bg-light-500 hover:bg-opacity-30 hover:dark:bg-dark-400 hover:dark:bg-opacity-40"
                  } flex items-center justify-start hover:rounded-lg`}
                >
                  <div className="bg-transparent flex items-end justify-start p-[12px]">
                    <Icon
                      icon={item.icon}
                      width={20}
                      height={20}
                      className="text-light900_dark100"
                    />
                    {isParagraphVisible && (
                      <p className="paragraph-regular ml-[12px]">
                        {item.label}
                      </p>
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
          <div
            className={`flex z-10 ${isParagraphVisible ? "w-full" : "w-fit"}`}
          >
            <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger
                className={`shadow-none border-custom ${
                  isParagraphVisible
                    ? "w-full flex bg-light-700 dark:bg-dark-400 rounded-lg text-dark100_light900 h-[32px] lg:px-3 px-2 py-[4px] items-center justify-start dark:bg-opacity-80"
                    : "w-fit bg-transparent justify-center p-0"
                }`}
              >
                <div className="flex w-full">
                  <Image
                    src={
                      adminInfo && adminInfo.avatar
                        ? newAva
                          ? newAva
                          : adminInfo.avatar
                        : "/assets/ava/default.png"
                    }
                    alt="logo"
                    width={isParagraphVisible ? 28 : 32}
                    height={isParagraphVisible ? 28 : 32}
                    className={`rounded-full`}
                  />
                  {isParagraphVisible && (
                    <div className="flex w-full justify-start items-center">
                      <p className="xl:paragraph-regular lg:body-regular md:small-regular lg:ml-[12px] ml-1 text-dark100_light900">
                        {adminInfo && adminInfo.firstName
                          ? adminInfo.firstName + " " + adminInfo.lastName
                          : "Unknown name"}
                      </p>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mb-[8px] ml-[28px] min-w-[344px] rounded-lg shadow-lg p-1 dark:bg-dark-200 bg-light-900 gap-2">
                <DropdownMenuLabel className="hover:bg-light-700 hover:rounded-lg hover:dark:bg-dark-400 hover:dark:bg-opacity-80">
                  <Button
                    className="text-dark100_light900 flex flex-1 items-center justify-start bg-transparent border-none shadow-none p-0 w-full"
                    onClick={handleAccount}
                  >
                    <div className="flex flex-row p-[8px] gap-[12px] justify-center items-end">
                      <Icon
                        icon="tabler:user-filled"
                        width={20}
                        height={20}
                        className="text-light900_dark100"
                      />

                      <p className="paragraph-regular text-dark100_light900">
                        My account
                      </p>
                    </div>
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuLabel className="hover:bg-light-700 hover:rounded-lg hover:dark:bg-dark-400 hover:dark:bg-opacity-80">
                  <Button
                    className="text-dark100_light900 flex flex-1 items-center justify-start bg-transparent border-none shadow-none p-0 w-full"
                    onClick={handleSetting}
                  >
                    <div className="flex flex-row p-[8px] gap-[12px] justify-center items-end">
                      <Icon
                        icon="lets-icons:setting-fill"
                        width={20}
                        height={20}
                        className="text-light900_dark100"
                      />

                      <p className="paragraph-regular text-dark100_light900">
                        Setting
                      </p>
                    </div>
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="w-full bg-transparent h-fit py-1">
                  <div className="w-full h-[1px] bg-light-500 dark:bg-dark-400"></div>
                </DropdownMenuSeparator>
                <DropdownMenuLabel className="hover:bg-light-700 hover:rounded-lg hover:dark:bg-dark-400 hover:dark:bg-opacity-80">
                  <div className="w-full flex relative ">
                    <Menubar className="w-full flex">
                      <MenubarMenu>
                        <MenubarTrigger
                          className="shadow-none border-none flex flex-1 items-center justify-between bg-transparent w-full"
                          onClick={toggleMenubar}
                        >
                          <div className="flex flex-row p-[8px] gap-[12px] justify-center items-end">
                            <Icon
                              icon="ic:baseline-language"
                              width={20}
                              height={20}
                              className="text-dark100_light900"
                            />

                            <p className="paragraph-regular text-dark100_light900">
                              Language
                            </p>
                          </div>
                          <Icon
                            icon="grommet-icons:next"
                            width={20}
                            height={20}
                            className="text-dark100_light900"
                          />
                        </MenubarTrigger>
                        {isMenubarOpen && (
                          <MenubarContent
                            side="right"
                            className="hover:boder-none ml-[13px] min-w-[218px] rounded-lg shadow-lg p-1 dark:bg-dark-200 bg-light-900 gap-2 justify-start items-center"
                          >
                            <MenubarItem className="hover:background-light700_dark400 hover:rounded-lg hover:border-none">
                              <Button
                                className="flex flex-row p-[8px] border-none shadow-none w-full justify-between items-center hover:border-none"
                                onClick={handleButtonVietNamClick}
                              >
                                <div className="flex gap-[12px] justify-start items-end w-fit">
                                  <Icon
                                    icon="twemoji:flag-vietnam"
                                    width={20}
                                    height={20}
                                    className="justify-start w-fit"
                                  />

                                  <p className="paragraph-regular text-dark100_light900">
                                    Vietnamese
                                  </p>
                                </div>
                                {selectedLanguage === "vietnamese" && (
                                  <Icon
                                    icon="mdi:tick"
                                    width={20}
                                    height={20}
                                    className="text-primary-500"
                                  />
                                )}
                              </Button>
                            </MenubarItem>
                            <MenubarSeparator className="w-full bg-transparent h-fit py-1">
                              <div className="w-full h-[1px] bg-light-500 dark:bg-dark-400"></div>
                            </MenubarSeparator>
                            <MenubarItem className="hover:background-light700_dark400 hover:rounded-lg hover:border-none">
                              <Button
                                className="flex flex-row p-[8px] border-none shadow-none w-full justify-between items-center hover:border-none"
                                onClick={handleButtonEnglishClick}
                              >
                                <div className="flex gap-[12px] justify-start items-end w-fit">
                                  <Icon
                                    icon="twemoji:flag-liberia"
                                    width={20}
                                    height={20}
                                    className="justify-start w-fit"
                                  />

                                  <p className="paragraph-regular text-dark100_light900">
                                    English
                                  </p>
                                </div>
                                {selectedLanguage === "english" && (
                                  <Icon
                                    icon="mdi:tick"
                                    width={20}
                                    height={20}
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
                    onClick={handleLogout}
                  >
                    <div className="flex flex-row p-[8px] gap-[12px] justify-center items-end">
                      <Icon
                        icon="material-symbols:logout"
                        width={20}
                        height={20}
                        className="text-accent-red"
                      />

                      <p className="paragraph-regular text-accent-red">
                        Log out
                      </p>
                    </div>
                  </Link>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div
            className={`responsive-sidebar ${
              isParagraphVisible ? "ml-[12px]" : ""
            }`}
          >
            <Button
              className="flex rounded-full background-light700_dark400 h-[32px] w-[32px] justify-center items-center"
              onClick={toggleParagraphVisibility}
            >
              <div className="flex items-end justify-center">
                <Icon
                  icon="zondicons:show-sidebar"
                  width={14}
                  height={14}
                  className="text-dark100_light900"
                />
              </div>
            </Button>
          </div>
        </div>
      </section>

      {isAccount && <PersonalAccount setPersonal={setAccount} />}
      {isSetting && <SettingLayout setSetting={setSetting} />}
    </>
  );
};

export default Leftsidebar;
