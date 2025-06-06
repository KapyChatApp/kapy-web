"use client";
import { useSocketContext } from "@/context/SocketContext";
import Image from "next/image";
import React from "react";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { OngoingCall } from "@/types/socket";
import { useGroupSocketContext } from "@/context/GroupCallContext";
import { OngoingGroupCall } from "@/types/group-call";
import { useUserContext } from "@/context/UserContext";
import { DetailCalling } from "@/lib/DTO/message";
import {
  editCallSummaryMessage,
  sendCallSummaryMessage
} from "@/utils/callingUtils";

const CallNotification = () => {
  const { ongoingCall, handleJoinCall, handleHangup } = useSocketContext();
  const {
    ongoingGroupCall,
    handleJoinGroupCall,
    handleGroupHangup,
    setOngoingGroupCall
  } = useGroupSocketContext();
  const { adminInfo } = useUserContext();

  // Kiểm tra xem có cuộc gọi nhóm đang đổ chuông không
  const isGroupCall = ongoingGroupCall?.isRinging ?? false;
  if (!ongoingCall?.isRinging && !ongoingGroupCall?.isRinging) return;

  const imgSrc = isGroupCall
    ? ongoingGroupCall?.participantsGroup.groupDetails.avatar
    : ongoingCall?.participants.caller.profile.avatar;

  const nameCaller = isGroupCall
    ? ongoingGroupCall?.participantsGroup.groupDetails.name
    : ongoingCall?.participants.caller.profile.firstName +
      " " +
      ongoingCall?.participants.caller.profile.lastName;

  const router = useRouter();
  const handleAcceptCall = async (ongoingCall: OngoingCall) => {
    router.push(`/socket/${ongoingCall.participants.caller.socketId}`);
    handleJoinCall(ongoingCall);
  };
  const handleJoinMeetingRoom = async (ongoingGroupCall: OngoingGroupCall) => {
    router.push(
      `/socket/${ongoingGroupCall.participantsGroup.groupDetails._id}`
    );
    handleJoinGroupCall(ongoingGroupCall);
  };
  const handleEndCall = async () => {
    if (isGroupCall) {
      const callerId = ongoingGroupCall?.participantsGroup.caller?.userId;
      const currentJoiners =
        ongoingGroupCall?.participantsGroup.currentJoiners || [];
      const totalParticipants = currentJoiners.length;

      const isCaller = callerId === adminInfo._id;

      // 👉 Logic xác định loại hành động
      const shouldEmitHangup = isCaller || totalParticipants <= 2;

      handleGroupHangup({
        ongoingGroupCall: ongoingGroupCall || undefined,
        isEmitHangup: shouldEmitHangup
      });

      toast({
        title: "Meeting Ended",
        className:
          "border-none rounded-lg bg-accent-blue text-white paragraph-regular items-center justify-center "
      });

      // 👉 Điều hướng
      if (shouldEmitHangup) {
        const participants = [
          ...(ongoingGroupCall?.participantsGroup.currentJoiners ?? []).map(
            (item) => item.userId
          )
        ].filter((id): id is string => id !== undefined);

        const detailCalling: DetailCalling = {
          type: "video",
          status: "rejected",
          duration: "00:00:00",
          isGroup: true,
          participants: participants
        };
        await editCallSummaryMessage(detailCalling, adminInfo._id);
        router.push("/group-chat/");
      } else {
        router.push(
          "/group-chat/" + ongoingGroupCall?.participantsGroup.groupDetails._id
        );
        setOngoingGroupCall(null);
      }
    } else {
      const participants = [
        ongoingCall?.participants.caller.userId,
        ongoingCall?.participants.receiver.userId
      ].filter((id): id is string => id !== undefined);
      const detailCalling: DetailCalling = {
        type: ongoingCall?.isVideoCall ? "video" : "audio",
        status: "rejected",
        duration: "00:00:00",
        isGroup: false,
        participants: participants
      };
      await sendCallSummaryMessage({
        ongoingCall,
        participants,
        detailCalling
      });
      router.push("/");
      toast({
        title: "Call Ended",
        className:
          "border-none rounded-lg bg-accent-blue text-white paragraph-regular items-center justify-center "
      });
      handleHangup({
        ongoingCall: ongoingCall ? ongoingCall : undefined,
        isEmitHangup: true
      });
    }
  };

  return (
    <div className="modal-overlay flex items-center justify-center z-[9999]">
      <div className="background-light850_dark200 min-h-[100px] min-w-[300px] flex flex-col items-center justify-center rounded p-4 gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-20 h-20 relative overflow-hidden rounded-lg">
            <Image
              src={imgSrc ? imgSrc : "/assets/ava/default.png"}
              alt="ava"
              fill
              className="object-cover cursor-pointer"
            />
          </div>
          <h3 className="text-dark100_light900">{nameCaller}</h3>
        </div>
        <p className="body-regular mb-2 text-dark100_light900">
          {isGroupCall ? "Incoming Meeting" : "Incoming Call"}
        </p>
        <div className="flex gap-8">
          <Button
            className="border-none bg-green-500 hover:bg-green-500 shadow-none w-full h-fit py-4 rounded-full font-bold text-light-900 text-[20px]"
            onClick={() => {
              if (isGroupCall && ongoingGroupCall)
                handleJoinMeetingRoom(ongoingGroupCall);
              else if (ongoingCall) handleAcceptCall(ongoingCall);
            }}
          >
            <Icon
              icon={
                isGroupCall
                  ? "mynaui:video-solid"
                  : ongoingCall?.isVideoCall
                  ? "mynaui:video-solid"
                  : "solar:phone-calling-rounded-bold"
              }
              width={24}
              height={24}
            />
          </Button>
          <Button
            className="border-none bg-accent-red hover:bg-accent-red   shadow-none w-full h-fit py-4 rounded-full font-bold text-light-900 text-[20px]"
            onClick={() => handleEndCall()}
          >
            <Icon icon="solar:end-call-bold" width={24} height={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
