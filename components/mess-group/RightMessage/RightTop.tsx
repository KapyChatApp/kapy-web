"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { formatTimeMessageBox } from "@/lib/utils";
import { useLayoutContext } from "@/context/LayoutContext";
import { useSocketContext } from "@/context/SocketContext";
import { SocketUser } from "@/types/socket";
import { useGroupSocketContext } from "@/context/GroupCallContext";
import { ParticipantsGroup, SocketGroup } from "@/types/group-call";
import { group } from "console";
import { DetailCalling, UserInfoBox } from "@/lib/DTO/message";
import { sendCallSummaryMessage } from "@/utils/callingUtils";
import { useChatContext } from "@/context/ChatContext";

interface RightTopProps {
  _id: string;
  ava: string;
  name: string;
  membersGroup: UserInfoBox[];
  onlineGroup: number;
  openMore: boolean;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
  isOnline: boolean;
}

interface rightTop {
  top: RightTopProps;
}

const RightTop: React.FC<rightTop> = ({ top }) => {
  const { _id, ava, name, membersGroup, onlineGroup, isOnline } = top;

  const pathname = usePathname();
  const isActiveGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);
  const { handleCall, onlineUsers } = useSocketContext();
  const { handleGroupCall, onlineGroupUsers } = useGroupSocketContext();
  const { openMore, setOpenMore } = useLayoutContext();
  const [timeOff, setTimeOff] = useState("");
  const handleOpenMore = () => {
    setOpenMore(!openMore);
  };
  const { adminInfo, isOnlineChat, timeOfflineChat } = useUserContext();

  const client =
    onlineUsers && onlineUsers.find((user) => user.profile._id === _id);

  const membersGroupId =
    Array.isArray(membersGroup) &&
    membersGroup
      .map((member) => member._id)
      .filter((item) => item !== adminInfo?._id);
  const clientGroup =
    onlineGroupUsers &&
    onlineGroupUsers.filter(
      (user) => membersGroupId && membersGroupId.includes(user.userId)
    );

  console.log("client >>>", client);
  console.log("clientGroup >>>", clientGroup);

  //Video Call
  // const client = useStreamVideoClient();
  // const { adminInfo, isOnlineChat } = useUserContext();
  // const [values, setValues] = useState({
  //   dateTime: new Date(),
  //   description: "",
  //   link: ""
  // });
  // const [callDetails, setCallDetails] = useState<Call>();
  // const router = useRouter();
  // const handleCreateMeeting = async () => {
  //   if (!client || !adminInfo) return;
  //   try {
  //     if (!values.dateTime) {
  //       toast({
  //         title: "Please select a date and time",
  //         className:
  //           "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
  //       });
  //       return;
  //     }
  //     const id = crypto.randomUUID();
  //     const call = client.call("default", id);

  //     if (!call) throw new Error("Fail to create call");

  //     const startsAt =
  //       values.dateTime.toISOString() || new Date(Date.now()).toISOString();

  //     const description = values.description || "Instant meeting";

  //     await call.getOrCreate({
  //       data: {
  //         starts_at: startsAt,
  //         custom: {
  //           description
  //         }
  //       }
  //     });

  //     setCallDetails(call);

  //     if (!values.description) {
  //       // const newTabUrl = `/calling/video/${call.id}`; // Tạo URL mới
  //       // window.open(newTabUrl);
  //       router.push(`/calling/video/${call.id}`);
  //     }

  //     toast({
  //       title: "Create video call",
  //       className:
  //         "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Call
  const router = useRouter();
  const { id } = useParams();
  const handleVideoCall = async (client: SocketUser) => {
    if (!client) return;
    router.push(`/socket/${client.socketId}`);
    handleCall(client, id.toString(), true);
  };

  const handleAudioCall = async (client: SocketUser) => {
    if (!client) return;
    router.push(`/socket/${client.socketId}`);
    handleCall(client, id.toString(), false);
  };

  const handleMeeting = async (
    clientGroup: SocketUser[],
    groupInfo: SocketGroup
  ) => {
    router.push(`/socket/${_id}`);
    handleGroupCall(clientGroup, groupInfo);
    const participants = clientGroup
      .map((item) => item.userId)
      .filter((id): id is string => id !== undefined);

    const detailCalling: DetailCalling = {
      type: "video",
      status: "ongoing",
      duration: "Is holding",
      isGroup: true,
      participants: participants
    };
    await sendCallSummaryMessage({
      participants,
      detailCalling,
      groupBoxId: _id,
      groupCaller: adminInfo._id
    });
  };

  //Online Status
  useEffect(() => {
    // Cập nhật ngay khi render lần đầu
    if (timeOfflineChat && timeOfflineChat[_id]) {
      const updateCreateAt = () => {
        const now = new Date();
        const sendDate = new Date(timeOfflineChat[_id]);
        const timeDifference = now.getTime() - sendDate.getTime();

        let formattedTime;
        if (timeDifference < 60000) {
          formattedTime = "1min";
        } else {
          formattedTime = formatTimeMessageBox(timeOfflineChat[_id]);
        }
        if (
          !formattedTime.includes("s") &&
          !formattedTime.includes("mins") &&
          !formattedTime.includes("min") &&
          !formattedTime.includes("h")
        ) {
          formattedTime = `Online since ${formattedTime}`;
        }
        setTimeOff(formattedTime);
      };

      updateCreateAt();

      const interval = setInterval(() => {
        updateCreateAt();
      }, 180000);

      return () => clearInterval(interval);
    }
  }, []);
  return (
    <div className="flex flex-row h-fit w-full lg:pl-[6px] pl-0 justify-between items-center">
      <div className="flex flex-row h-full">
        <div className="flex flex-row items-center justify-start">
          <div className="relative flex-shrink-0 w-fit">
            <Image
              src={ava ? ava : "/assets/ava/default.png"}
              alt="ava"
              width={48}
              height={48}
              className="rounded-full lg:w-12 lg:h-12 w-10 h-10"
            />
            {isOnline && (
              <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
            )}
          </div>

          <div className="flex flex-col justify-start pl-[8px] lg:gap-[6px] gap-1">
            <div className="flex items-center justify-start">
              <p className="paragraph-regular text-dark100_light900">{name}</p>
            </div>
            <div className="flex items-center justify-start">
              {isActiveGroup ? (
                <p className="small-light text-dark100_light900">
                  {membersGroup.length} members, {onlineGroup} onlines
                </p>
              ) : (
                <p className="small-light text-dark100_light900">
                  {timeOff &&
                    !isOnlineChat[_id] &&
                    (timeOff.includes("Online since")
                      ? timeOff
                      : `Online ${timeOff} ago`)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start h-full gap-[10px] lg:gap-4">
        <Button
          className="flex bg-transparent cursor-pointer shadow-none hover:shadow-none focus:shadow-none outline-none border-none p-[2px]"
          onClick={() => {
            if (isActiveGroup) {
              if (clientGroup) {
                handleMeeting(clientGroup, {
                  _id: _id,
                  name: name,
                  avatar: ava,
                  members: membersGroup
                });
              }
            } else {
              if (client) {
                handleVideoCall(client);
              }
            }
          }}
        >
          <Icon
            icon="fluent:video-20-filled"
            width={24}
            height={24}
            className="text-primary-500 md:w-6 md:h-6 w-[22px] h-[22px]"
          />
        </Button>

        {!isActiveGroup && (
          <Button
            className="flex bg-transparent cursor-pointer shadow-none hover:shadow-none focus:shadow-none outline-none border-none p-[2px]"
            onClick={() => client && handleAudioCall(client)}
          >
            <Icon
              icon="ion:call"
              width={24}
              height={24}
              className="text-primary-500 md:w-6 md:h-6 w-[22px] h-[22px]"
            />
          </Button>
        )}

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
