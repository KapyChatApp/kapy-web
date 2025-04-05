"use client";
import { useSocketContext } from "@/context/SocketContext";
import Image from "next/image";
import React from "react";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { OngoingCall } from "@/types";
import { toast } from "@/hooks/use-toast";

const CallNotification = () => {
  const { ongoingCall, handleJoinCall, handleHangup, isCallEnded } =
    useSocketContext();

  if (!ongoingCall?.isRinging) return;
  console.log("calling...");
  console.log("Online users: ", ongoingCall.participants);

  const router = useRouter();
  const handleAcceptCall = async (ongoingCall: OngoingCall) => {
    router.push(`/socket/${ongoingCall.participants.caller.socketId}`);
    handleJoinCall(ongoingCall);
  };
  const handleEndCall = async () => {
    handleHangup({
      ongoingCall: ongoingCall ? ongoingCall : undefined,
      isEmitHangup: true
    });
    toast({
      title: "Call Ended",
      className:
        "border-none rounded-lg bg-accent-blue text-white paragraph-regular items-center justify-center "
    });
    router.push("/");
  };

  return (
    <div className="modal-overlay flex items-center justify-center z-[9999]">
      <div className="bg-white min-h-[100px] min-w-[300px] flex flex-col items-center justify-center rounded p-4 gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-20 h-20 relative overflow-hidden rounded-lg">
            <Image
              src={
                ongoingCall.participants.caller.profile.avatar
                  ? ongoingCall.participants.caller.profile.avatar
                  : "/assets/ava/default.png"
              }
              alt="ava"
              fill
              className="object-cover cursor-pointer"
            />
          </div>
          <h3>
            {ongoingCall.participants.caller.profile.firstName}{" "}
            {ongoingCall.participants.caller.profile.lastName}
          </h3>
        </div>
        <p className="body-regular mb-2">Incoming Call</p>
        <div className="flex gap-8">
          <Button
            className="border-none bg-green-500 hover:bg-green-500 shadow-none w-full h-fit py-4 rounded-full font-bold text-light-900 text-[20px]"
            onClick={() => handleAcceptCall(ongoingCall)}
          >
            <Icon
              icon="solar:phone-calling-rounded-bold"
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
