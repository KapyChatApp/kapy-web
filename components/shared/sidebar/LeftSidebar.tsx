"use client";
import React from "react";
import { sidebarLinks } from "@/constants/index";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Leftsidebar = () => {
  const pathname = usePathname();
  return (
    <section className="background-light850_dark200 flex h-screen flex-col justify-start overflow-hidden border-none p-[16px]">
      <div className="flex-1">
        <div className="flex flex-col">
          <Link
            key="logo"
            href="/"
            className="text-dark100_light900 flex items-center justify-start bg-transparent gap-[18px]"
          >
            <Image
              src="/assets/images/icon.png"
              alt="logo"
              width={32}
              height={32}
            />
            <p className="h2-bold max-sm:hidden">KAPY ChatApp</p>
          </Link>
        </div>
        <div className="flex flex-col mt-[32px]">
          {sidebarLinks.map((item) => {
            const isActive =
              (pathname.includes(item.route) && item.route.length > 1) ||
              pathname === item.route;
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`${
                  isActive
                    ? "background-light700_dark400 dark:opacity-80 rounded-lg w-[240px] h-[44px] text-dark100_light900"
                    : "text-dark100_light900"
                } flex items-center justify-start bg-transparent `}
              >
                <div className="bg-transparent flex items-center justify-start p-[12px]">
                  <Icon
                    icon={item.icon}
                    width={18}
                    height={18}
                    className="background-light900_dark100"
                  />
                  <p className="paragraph-regular ml-[12px]">{item.label}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-row mt-auto">
        <div className="flex">
          <Button className="flex background-light700_dark400 dark:opacity-80 rounded-lg text-light900_dark100 h-[32px] w-[200px] px-3 py-[4px] items-center justify-start">
            <div className="flex ">
              <Image
                src="/assets/images/icon.png"
                alt="logo"
                width={24}
                height={24}
              />

              <p className="paragraph-regular ml-[12px]">Junie</p>
            </div>
          </Button>
        </div>
        <div className="flex ml-[12px]">
          <Button className="flex rounded-full background-light700_dark400 h-[32px] w-[32px] justify-center items-center">
            <div className="flex items-end justify-center">
              <Icon
                icon="zondicons:show-sidebar"
                width={14}
                height={14}
                className="background-light900_dark100"
              />
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Leftsidebar;
