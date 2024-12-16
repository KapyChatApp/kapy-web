"use client";
import MeetingRoom from "@/components/calling/MeetingRoom";
import MeetingSetup from "@/components/calling/MeetingSetup";
import { useUserContext } from "@/context/UserContext";
import { useGetCallById } from "@/hooks/use-get-call";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";

const page = ({ params: { id } }: { params: { id: string } }) => {
  const { adminInfo } = useUserContext();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);

  if (isCallLoading) {
    return <div>Loading...</div>;
  }

  if (!call) {
    return <div>Call not found</div>;
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default page;
