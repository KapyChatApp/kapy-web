"use client";
import { useGroupSocketContext } from "@/context/GroupCallContext";
import { useSocketContext } from "@/context/SocketContext";
import React from "react";
import PersonalRoom from "./PersonalRoom";
import MeetingRoom from "./MeetingRoom";

const VideoCall = () => {
  const { ongoingCall } = useSocketContext();
  const { ongoingGroupCall } = useGroupSocketContext();

  if (!ongoingCall && !ongoingGroupCall) return null;

  if (ongoingCall) return <PersonalRoom />;
  if (ongoingGroupCall) return <MeetingRoom />;
};

export default VideoCall;
