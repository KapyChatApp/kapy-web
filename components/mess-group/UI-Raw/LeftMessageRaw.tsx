import React, { useEffect, useState } from "react";
import GlobalSearch from "../../shared/search/globalSearch";
import MessageBox from "../MessageBox";
import useSearchMessageBox from "@/hooks/use-search-message-box";
import { usePathname } from "next/navigation";
import { boxGroup } from "@/constants/groups";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useChatContext } from "@/context/ChatContext";
import { getPusherClient } from "@/lib/pusher";
import { useUserContext } from "@/context/UserContext";
import { useFriendContext } from "@/context/FriendContext";
import useSearchFriend from "@/hooks/use-search-list-friend";
import CreateGroup from "../LeftMessage/CreateGroup";

const LeftMessageRaw = () => {
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
  //CREATE BOX GROUP
  const [boxCreated, setBoxCreated] = useState(boxGroup);
  const handleAddGroup = () => {
    const newGroup = {
      otherId: (boxCreated.length + 1).toString(),
      otherName: `New Group ${boxCreated.length + 1}`,
      ava: "/assets/images/icon.png",
      sender: "",
      content: "This is a new group message.",
      pin: false,
      time: "just now",
      isOnline: false,
      isSeen: false
    };

    setBoxCreated([...boxCreated, newGroup]);
    console.log(boxCreated);
  };

  return (
    <>
      <div className="flex flex-col background-light900_dark400 w-full h-full py-[16px] px-[8px] rounded-tl-[12px] rounded-bl-[12px] rounded-tr-[12px] rounded-br-[12px] lg:rounded-tr-[0px] lg:rounded-br-[0px] md:rounded-tr-[0px] md:rounded-br-[0px]">
        <p className="text-xl lg:text-2xl font-medium lg:font-bold text-dark100_light900 px-2">
          {isGroup ? "Groups" : "Messages"}
        </p>

        <div className="mt-8 flex w-full h-full flex-col scrollable overflow-scroll items-center justify-start gap-6">
          <Icon
            icon="mage:message-dots-round-plus"
            width={100}
            height={100}
            className="text-primary-500"
          />
          <div className="flex flex-col w-full gap-2 justify-center items-center">
            <p className="text-dark100_light900 paragraph-bold">{label1}</p>
            <p className="text-dark100_light900 body-light">{label2}</p>
            <p className="text-dark100_light900 body-light">{label3}</p>
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
};

export default LeftMessageRaw;
