"use client";
import { useGroupSocketContext } from "@/context/GroupCallContext";
import { useSocketContext } from "@/context/SocketContext";
import { DetailCalling } from "@/lib/DTO/message";
import { SocketGroup } from "@/types/group-call";
import { SocketUser } from "@/types/socket";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";

const CallingSegment = ({
  detail,
  client,
  clientGroup,
  groupInfo
}: {
  detail: DetailCalling;
  client?: SocketUser | null;
  clientGroup?: SocketUser[] | null;
  groupInfo?: SocketGroup | null;
}) => {
  const { handleCall } = useSocketContext();
  const { handleGroupCall } = useGroupSocketContext();
  const { type, status, duration, isGroup } = detail;
  const iconDone =
    type === "video"
      ? "material-symbols:video-call-rounded"
      : "solar:outgoing-call-bold";
  const iconRejected =
    type === "video"
      ? "material-symbols:missed-video-call-rounded"
      : "solar:call-cancel-bold";

  const router = useRouter();
  const { id } = useParams();

  //Event Click
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
    router.push(`/socket/${groupInfo._id}`);
    handleGroupCall(clientGroup, groupInfo);
  };
  return (
    <div
      className={`background-light700_dark200 bg-opacity-50 p-3 rounded-[18px] flex flex-wrap w-fit h-full items-center justify-center cursor-pointer`}
      onClick={() => {
        if (type === "video") {
          if (isGroup) {
            if (clientGroup && groupInfo) {
              handleMeeting(clientGroup, groupInfo);
            }
          } else {
            if (client) {
              handleVideoCall(client);
            }
          }
        } else {
          client && handleAudioCall(client);
        }
      }}
    >
      <span className="flex gap-3 items-center justify-center">
        <Icon
          icon={status === "completed" ? iconDone : iconRejected}
          width={24}
          height={24}
          className="text-dark300_light800 md:w-6 md:h-6 w-5 h-5"
        />
        <span className="flex flex-col">
          <p className="text-dark300_light800 flex-wrap md:text-[14px] text-[13px] font-[320px]">
            {type === "video" ? "Video Call" : "Audio Call"}
          </p>
          <p className="text-dark300_light800 flex-wrap md:text-[14px] text-[13px] font-[320px]">
            {duration}
          </p>
        </span>
      </span>
    </div>
  );
};

export default CallingSegment;
