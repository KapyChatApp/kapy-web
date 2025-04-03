"use client";
import { useSocketContext } from "@/context/SocketContext";
import React from "react";

const CallNotification = () => {
  const { ongoingCall } = useSocketContext();

  if (!ongoingCall?.isRinging) return;

  return (
    <div className="absolute background-light850_dark200 w-screen h-screen top-0 bottom-0 bg-opacity-70 flex item-center justify-center">
      Someone is calling
    </div>
  );
};

export default CallNotification;
