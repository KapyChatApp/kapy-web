import React, { useEffect, useState } from "react";
import GlobalSearch from "../../shared/search/globalSearch";
import MessageBox from "../MessageBox";
import useSearchMessageBox from "@/hooks/use-search-message-box";
import { usePathname } from "next/navigation";
import { boxGroup } from "@/constants/groups";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import CreateGroup from "./CreateGroup";
import { useChatContext } from "@/context/ChatContext";
import { getPusherClient } from "@/lib/pusher";
import { useUserContext } from "@/context/UserContext";

export interface LeftMessageProps {
  setClickBox?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickOtherRight?: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface OnlineEvent {
  userId: string;
  online: boolean;
}

const LeftMessage = ({ setClickBox, setClickOtherRight }: LeftMessageProps) => {
  const pathname = usePathname();
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);
  const { dataChat } = useChatContext();

  const searchChat = useSearchMessageBox(dataChat);
  const { searchTerm, setSearchTerm, filteredBox } = React.useMemo(() => {
    return searchChat;
  }, [searchChat]);
  const { setIsOnlineChat, isOnlineChat } = useUserContext();
  const [isOnlineGroup, setIsOnlineGroup] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const handleOnline = (data: OnlineEvent) => {
      console.log("Successfully received message: ", data);

      // Khởi tạo bản sao trạng thái cập nhật
      setIsOnlineChat((prevState) => {
        const updatedOnlineStatus = { ...prevState };
        for (const box of dataChat) {
          for (const user of box.memberInfo) {
            if (user.id === data.userId) {
              updatedOnlineStatus[data.userId] = true;
            }
          }
        }
        return updatedOnlineStatus;
      });
    };

    const pusherClient = getPusherClient();
    const subscriptions: Array<{ channel: string; event: string }> = [];
    dataChat.forEach((box) => {
      box.memberInfo.forEach((user) => {
        const channel = `private-${user.id}`;
        pusherClient.subscribe(channel).bind("online-status", handleOnline);
        subscriptions.push({ channel, event: "online-status" });
      });
    });
  }, [dataChat, setIsOnlineChat]);

  //OPEN MODAL CreateGroup
  const [isCreated, setCreated] = useState(false);
  const handleCreated = () => {
    setCreated(!isCreated);
  };

  //CREATE BOX GROUP
  const [boxCreated, setBoxCreated] = useState(boxGroup);
  const handleAddGroup = () => {
    const newGroup = {
      id: (parseInt(boxCreated[dataChat.length - 1].id) + 1).toString(),
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

        <GlobalSearch onChange={(e) => setSearchTerm(e.target.value)} />

        <div className="mt-[12px] flex w-full flex-col scrollable overflow-scroll">
          {filteredBox.length > 0
            ? filteredBox.map((item) => {
                return (
                  <MessageBox
                    box={item}
                    setClickBox={setClickBox}
                    setClickOtherRight={setClickOtherRight}
                  />
                );
              })
            : null}
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

export default LeftMessage;
