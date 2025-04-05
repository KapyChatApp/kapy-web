"use client";
import { useSocketContext } from "@/context/SocketContext";
import React, { useCallback, useEffect } from "react";
import VideoContainer from "./VideoContainer";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const VideoCall = () => {
  const { localStream, peer, ongoingCall, handleHangup, isCallEnded } =
    useSocketContext();
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isVidOn, setIsVidOn] = React.useState(true);

  console.log("peer>>>", peer?.stream);
  console.log("localStream>>>", localStream);

  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      setIsVidOn(videoTrack.enabled);
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVidOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const isOnCall = localStream && peer && ongoingCall ? true : false;

  const router = useRouter();
  const handleEndCall = () => {
    router.push("/");
    handleHangup({
      ongoingCall: ongoingCall ? ongoingCall : undefined,
      isEmitHangup: true
    });
  };

  if (!localStream && !peer && !ongoingCall && isCallEnded) {
    router.push("/");
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
        <div className="w-full h-auto items-center flex justify-center">
          {localStream && (
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

        <div className="mt-8 flex item-center">
          <Button
            className="border-none bg-transparent shadow-none w-full h-fit text-dark100_light900"
            onClick={toggleMic}
          >
            <Icon
              icon={
                isMicOn ? "fluent:mic-off-24-regular" : "fluent:mic-24-regular"
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
            className="border-none bg-transparent shadow-none w-full h-fit text-dark100_light900"
            onClick={toggleCamera}
          >
            <Icon
              icon={
                isVidOn
                  ? "heroicons:video-camera-slash"
                  : "heroicons:video-camera"
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

export default VideoCall;
