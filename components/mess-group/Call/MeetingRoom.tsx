"use client";
import { useGroupSocketContext } from "@/context/GroupCallContext";
import { useMediaControls } from "@/hooks/use-media";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const MeetingRoom = () => {
  const {
    localStream,
    peer,
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
  } = useMediaControls({ localStream, peer, ongoingCall: ongoingGroupCall });

  console.log("ongoingCall in Group >>>", ongoingGroupCall);
  console.log("peer in Group >>>", peer);

  const router = useRouter();
  const handleEndCall = () => {
    router.push(
      "/group-chat/" + ongoingGroupCall?.participantsGroup.groupDetails._id
    );
    handleGroupHangup({
      ongoingGroupCall: ongoingGroupCall ? ongoingGroupCall : undefined,
      isEmitHangup: true
    });
  };

  if (!localStream && !peer && !ongoingGroupCall && isCallEnded) {
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
  return <div>Meeting Room </div>;
};

export default MeetingRoom;
