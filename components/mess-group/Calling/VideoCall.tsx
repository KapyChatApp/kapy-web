"use client";
import { useSocketContext } from "@/context/SocketContext";
import React, { useCallback, useEffect } from "react";
import VideoContainer from "./VideoContainer";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

const VideoCall = () => {
  const { localStream } = useSocketContext();
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isVidOn, setIsVidOn] = React.useState(true);

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

  return (
    <div className="flex flex-row w-full h-full">
      <div className="background-light900_dark400 rounded-tr-[12px] rounded-br-[12px] pl-[16px] rounded-tl-[0px] rounded-bl-[0px] w-full items-center justify-center flex flex-col h-full">
        <div className="w-full h-auto items-center flex justify-center">
          {localStream && (
            <VideoContainer
              stream={localStream}
              isLocalStream={true}
              isOnCall={false}
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

          <Button className="border-none bg-accent-red hover:bg-accent-red shadow-none w-full h-fit text-light-900 text-[20px] rounded ">
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
