"use client";
import { useGroupSocketContext } from "@/context/GroupCallContext";
import { useMediaControls } from "@/hooks/use-media";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import VideoContainer from "./VideoContainer";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useUserContext } from "@/context/UserContext";
import { DetailCalling } from "@/lib/DTO/message";
import { editCallSummaryMessage } from "@/utils/callingUtils";

const MeetingRoom = () => {
  const {
    localStream,
    peers,
    ongoingGroupCall,
    handleGroupHangup,
    isCallEnded
  } = useGroupSocketContext();
  const {
    isOnCall,
    isMicOn,
    isVidOn,
    isScreenOn,
    currentStream,
    callDuration,
    formatTime,
    toggleCamera,
    toggleMic,
    toggleScreenShare
  } = useMediaControls({
    localStream,
    peer: peers,
    ongoingCall: ongoingGroupCall
  });
  const { adminInfo } = useUserContext();

  console.log("ongoingCall in Group >>>", ongoingGroupCall);
  console.log("peer in Group >>>", peers);

  const router = useRouter();
  const handleEndCall = async () => {
    const callerId = ongoingGroupCall?.participantsGroup.caller?.userId;
    const currentJoiners =
      ongoingGroupCall?.participantsGroup.currentJoiners || [];
    const totalParticipants = currentJoiners.length;

    const isCaller = callerId === adminInfo._id;

    // 👉 Logic xác định loại hành động
    const shouldEmitHangup = isCaller || totalParticipants <= 2;

    // 👉 Điều hướng
    if (shouldEmitHangup) {
      const participants = [
        ...(ongoingGroupCall?.participantsGroup.currentJoiners ?? []).map(
          (item) => item.userId
        )
      ];

      const detailCalling: DetailCalling = {
        type: "video",
        status: "completed",
        duration: formatTime(callDuration),
        isGroup: true,
        participants: participants
      };
      await editCallSummaryMessage(detailCalling, adminInfo._id);
      router.push("/group-chat/");
    } else {
      router.push(
        "/group-chat/" + ongoingGroupCall?.participantsGroup.groupDetails._id
      );
    }

    handleGroupHangup({
      ongoingGroupCall: ongoingGroupCall || undefined,
      isEmitHangup: shouldEmitHangup
    });

    toast({
      title: "Meeting Ended",
      className:
        "border-none rounded-lg bg-accent-blue text-white paragraph-regular items-center justify-center "
    });
  };

  if (!localStream && !peers && !ongoingGroupCall && isCallEnded) {
    router.push("/group-chat/");
    toast({
      title: "Meeting Ended",
      className:
        "border-none rounded-lg bg-accent-blue text-white paragraph-regular items-center justify-center "
    });
    return;
  }
  if (isCallEnded) {
    toast({
      title: "Meeting Ended",
      className:
        "border-none rounded-lg bg-accent-blue text-white paragraph-regular items-center justify-center "
    });
    router.push(
      "/group-chat/" + ongoingGroupCall?.participantsGroup.groupDetails._id
    );
    return null;
  }
  return (
    <div className="modal-overlay-post">
      {/* Close Button */}
      <div className="absolute top-4 right-4">
        <Button
          className="flex bg-transparent shadow-none p-2 border-none hover:bg-transparent h-10 w-10"
          onClick={handleEndCall}
        >
          <Icon
            icon="mingcute:close-fill"
            width={40}
            height={40}
            className="text-light-700"
          />
        </Button>
      </div>
      <div className="max-w-[1054px] h-full rounded-lg flex items-center justify-center flex-col p-4 gap-4">
        {ongoingGroupCall && (
          <div className="w-full max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentStream && (
              <div className="flex flex-col gap-2">
                <span className="text-primary-500">You</span>
                <VideoContainer
                  stream={currentStream}
                  isLocalStream={true}
                  isOnCall={isOnCall}
                  isMeetingRoom={true}
                />
              </div>
            )}
            {peers &&
              peers.map((peerItem, index) => {
                if (peerItem.stream) {
                  return (
                    <div className="flex flex-col gap-2">
                      <span className="text-light-500">
                        {peerItem.participantUser.profile.firstName}{" "}
                        {peerItem.participantUser.profile.lastName}
                      </span>
                      <VideoContainer
                        key={index}
                        stream={peerItem.stream}
                        isLocalStream={false}
                        isOnCall={isOnCall}
                        isMeetingRoom={true}
                      />
                    </div>
                  );
                }
                return null;
              })}
          </div>
        )}

        {peers && localStream && (
          <span className="text-green-500 body-regular">
            {formatTime(callDuration)}
          </span>
        )}

        <div className="mt-8 flex item-center">
          <Button
            className="border-none bg-transparent shadow-none w-full h-fit text-light500_light700"
            onClick={() => toggleScreenShare()}
          >
            <Icon
              icon={
                isScreenOn
                  ? "fluent:share-screen-person-16-filled"
                  : "fluent:share-screen-person-16-regular"
              }
              width={28}
              height={28}
            />
          </Button>

          <Button
            className="border-none bg-transparent shadow-none w-full h-fit text-light500_light700"
            onClick={toggleMic}
          >
            <Icon
              icon={
                isMicOn ? "fluent:mic-24-regular" : "fluent:mic-off-24-regular"
              }
              width={28}
              height={28}
            />
          </Button>

          <Button
            className="border-none bg-accent-red hover:bg-accent-red shadow-none w-full h-fit text-light-900 text-[20px] rounded "
            onClick={handleEndCall}
          >
            End Call
          </Button>

          <Button
            className="border-none bg-transparent shadow-none w-full h-fit text-light500_light700"
            onClick={toggleCamera}
          >
            <Icon
              icon={
                isVidOn
                  ? "heroicons:video-camera"
                  : "heroicons:video-camera-slash"
              }
              width={28}
              height={28}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
