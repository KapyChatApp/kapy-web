"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CreateGroup from "../LeftMessage/CreateGroup";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import GlobalSearch from "@/components/shared/search/globalSearch";

export function SkeletonDemo() {
  const pathname = usePathname();
  const isGroup = /^\/group-chat/.test(pathname);

  //OPEN MODAL CreateGroup
  const [isCreated, setCreated] = useState(false);
  const handleCreated = () => {
    setCreated(!isCreated);
  };

  const label1 = isGroup ? "No groups" : "No message";
  const label2 = "Let's add some friends and";
  const label3 = isGroup
    ? "New group chat will appear here"
    : "New message will appear here";
  return (
    <>
      <div className="flex flex-col background-light900_dark400 w-full h-full py-[16px] px-[8px] rounded-tl-[12px] rounded-bl-[12px] rounded-tr-[12px] rounded-br-[12px] lg:rounded-tr-[0px] lg:rounded-br-[0px] md:rounded-tr-[0px] md:rounded-br-[0px]">
        <p className="text-xl lg:text-2xl font-medium lg:font-bold text-dark100_light900 px-2">
          {isGroup ? "Groups" : "Messages"}
        </p>
        <GlobalSearch />
        <div className="mt-[12px] flex w-full h-full flex-col scrollable overflow-scroll items-center justify-start ">
          <div className="flex items-center space-x-4 w-full ">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
          </div>
        </div>

        {isGroup && (
          <div className="flex flex-row mt-auto justify-start w-full">
            <Button
              className="shadow-none border-none min-w-fit bg-transparent min-h-fit p-0 flex flex-row items-center justify-start"
              onClick={handleCreated}
            >
              <div className="rounded-full p-[12px] bg-primary-500 bg-opacity-20">
                <Icon
                  icon="mingcute:add-fill"
                  className=" text-primary-500  "
                />
              </div>
              <p className="paragraph-semibold text-primary-500 ml-[12px]">
                Create group
              </p>
            </Button>
          </div>
        )}
      </div>

      {isCreated && <CreateGroup setCreated={setCreated} />}
    </>
  );
}
