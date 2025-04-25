"use client";
import { useSocketContext } from "@/context/SocketContext";
import React, { useCallback, useEffect, useState } from "react";
import VideoContainer from "./VideoContainer";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { useMediaControls } from "@/hooks/use-media";
import { handleSendTextMessage } from "@/lib/services/message/send/sendText";
import { DetailCalling } from "@/lib/DTO/message";
import { sendCallSummaryMessage } from "@/utils/callingUtils";

const PersonalRoom = () => {
  const { localStream, peer, ongoingCall, handleHangup, isCallEnded } =
    useSocketContext();
  const isCaller =
    peer?.participantUser?.userId === ongoingCall?.participants.caller.userId;
  const avatarUrl = isCaller
    ? ongoingCall?.participants.caller.profile.avatar
    : ongoingCall?.participants.receiver.profile.avatar;
  const namePaticipant = isCaller
    ? ongoingCall?.participants.caller.profile.firstName +
      " " +
      ongoingCall?.participants.caller.profile.lastName
    : ongoingCall?.participants.receiver.profile.firstName +
      " " +
      ongoingCall?.participants.receiver.profile.lastName;

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
  } = useMediaControls({ localStream, peer, ongoingCall });

  console.log("ongoingCall", ongoingCall);
  console.log("peer", peer);
  console.log("localStream", localStream);
  console.log("isCallEnded", isCallEnded);

  const router = useRouter();
  const handleEndCall = async () => {
    //router.push(`/${ongoingCall?.participants.caller.userId}`);
    const participants = [
      ongoingCall?.participants.caller.userId,
      ongoingCall?.participants.receiver.userId
    ].filter((id): id is string => id !== undefined);
    const detailCalling: DetailCalling = {
      type: ongoingCall?.isVideoCall ? "video" : "audio",
      status: "completed",
      duration: formatTime(callDuration),
      isGroup: false,
      participants: participants
    };
    await sendCallSummaryMessage({ ongoingCall, participants, detailCalling });
    handleHangup({
      ongoingCall: ongoingCall ? ongoingCall : undefined,
      isEmitHangup: true
    });
    router.push(`/`);
    toast({
      title: "Call Ended",
      className:
        "border-none rounded-lg bg-accent-blue text-white paragraph-regular items-center justify-center "
    });
  };

  if (!localStream && !peer && !ongoingCall && isCallEnded) {
    router.push(`/`);
    toast({
      title: "Call Ended",
      className:
        "border-none rounded-lg bg-accent-blue text-white paragraph-regular items-center justify-center "
    });
    return;
  }
  if (isCallEnded) {
    toast({
      title: "Call Ended",
      className:
        "border-none rounded-lg bg-accent-blue text-white paragraph-regular items-center justify-center "
    });
    router.push("/");
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
        {ongoingCall &&
          (ongoingCall.isVideoCall ? (
            <div className="w-full h-auto items-center flex justify-center">
              {currentStream && (
                <VideoContainer
                  stream={localStream}
                  isLocalStream={true}
                  isOnCall={isOnCall}
                />
              )}
              {peer && peer.stream && (
                <VideoContainer
                  stream={peer.stream}
                  isLocalStream={false}
                  isOnCall={isOnCall}
                />
              )}
            </div>
          ) : (
            <div className="background-light850_dark200 min-h-[100px] min-w-[300px] flex flex-col items-center justify-center rounded p-4 gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-20 h-20 relative overflow-hidden rounded-lg">
                  <Image
                    src={avatarUrl ? avatarUrl : "/assets/ava/default.png"}
                    alt="ava"
                    fill
                    className="object-cover cursor-pointer"
                  />
                </div>
                <h3 className="text-dark100_light900">{namePaticipant}</h3>
              </div>
            </div>
          ))}

        {peer && localStream && (
          <span className="text-green-500 body-regular">
            {formatTime(callDuration)}
          </span>
        )}

        <div className="mt-8 flex item-center">
          <Button
            className="border-none bg-transparent shadow-none w-full h-fit text-light500_light700"
            onClick={() => toggleScreenShare()}
            disabled={!ongoingCall?.isVideoCall}
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
            disabled={!ongoingCall?.isVideoCall}
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

export default PersonalRoom;
