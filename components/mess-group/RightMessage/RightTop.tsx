"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUserContext } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";

interface RightTopProps {
  ava: string;
  name: string;
  membersGroup: string;
  onlineGroup: number;
  openMore: boolean;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
}

interface rightTop {
  top: RightTopProps;
  setClickBox?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickOtherRight: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightTop: React.FC<rightTop> = ({
  top,
  setClickBox,
  setClickOtherRight
}) => {
  const { ava, name, membersGroup, onlineGroup, openMore, setOpenMore } = top;

  const pathname = usePathname();
  const isActiveGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);

  const handleBack = () => {
    if (setClickBox) {
      setClickBox(false); //Responsive
    }
  };

  const handleOpenMore = () => {
    const newOpenMore = !openMore;
    setOpenMore(!openMore);
    sessionStorage.setItem("openMore", JSON.stringify(newOpenMore));
    setClickOtherRight(true); //Responsive
  };

  const client = useStreamVideoClient();
  const { adminInfo } = useUserContext();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: ""
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const router = useRouter();
  const handleCreateMeeting = async () => {
    if (!client || !adminInfo) return;
    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time",
          className:
            "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Fail to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      });

      setCallDetails(call);

      if (!values.description) {
        // const newTabUrl = `/calling/video/${call.id}`; // Tạo URL mới
        // window.open(newTabUrl);
        router.push(`/calling/video/${call.id}`);
      }

      toast({
        title: "Create video call",
        className:
          "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-row h-fit w-full lg:pl-[6px] pl-0 justify-between items-center">
      <div className="flex flex-row h-full">
        <div
          className="lg:hidden md:hidden flex w-fit h-full items-center justify-start cursor-pointer mr-4"
          onClick={handleBack}
        >
          <Icon
            icon="eva:arrow-back-fill"
            width={30}
            height={30}
            className="text-primary-500"
          />
        </div>
        <div className="flex flex-row items-center justify-start">
          <Image
            src={ava}
            alt="ava"
            width={48}
            height={48}
            className="rounded-full lg:w-12 lg:h-12 w-10 h-10"
          />
          {isActiveGroup ? (
            <div className="flex flex-col justify-start pl-[8px] lg:gap-[6px] gap-1">
              <div className="flex items-center justify-start">
                <p className="paragraph-regular text-dark100_light900">
                  {name}
                </p>
              </div>
              <div className="flex items-center justify-start">
                <p className="small-light text-dark100_light900">
                  {membersGroup} members, {onlineGroup} onlines
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center ml-[8px]">
              <p className="paragraph-regular text-dark100_light900">{name}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-start h-full gap-[10px] lg:gap-4">
        <Button
          className="flex bg-transparent cursor-pointer shadow-none hover:shadow-none focus:shadow-none outline-none border-none p-[2px]"
          onClick={handleCreateMeeting}
        >
          <Icon
            icon="fluent:video-20-filled"
            width={24}
            height={24}
            className="text-primary-500 md:w-6 md:h-6 w-[22px] h-[22px]"
          />
        </Button>

        <Button className="flex bg-transparent cursor-pointer shadow-none hover:shadow-none focus:shadow-none outline-none border-none p-[2px]">
          <Icon
            icon="ion:call"
            width={24}
            height={24}
            className="text-primary-500 md:w-6 md:h-6 w-[22px] h-[22px]"
          />
        </Button>

        <Button
          className={`${
            openMore ? "bg-primary-500 hover:bg-primary-500" : "bg-transparent"
          } flex cursor-pointer shadow-none border-none rounded-full h-fit p-[2px] hover:bg-primary-500`}
          onClick={handleOpenMore}
        >
          <Icon
            icon="basil:other-1-outline"
            width={24}
            height={24}
            className={`rounded-full transition-colors duration-200 ease-in-out md:w-6 md:h-6 w-[22px] h-[22px] hover:text-light-900 ${
              openMore ? " text-light-900 " : "text-primary-500"
            }`}
          />
        </Button>
      </div>
    </div>
  );
};

export default RightTop;
