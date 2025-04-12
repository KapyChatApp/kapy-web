import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface iVideoContainer {
  stream: MediaStream | null;
  isLocalStream: boolean;
  isOnCall: boolean;
  isMeetingRoom?: boolean;
}
const VideoContainer = ({
  stream,
  isLocalStream,
  isOnCall,
  isMeetingRoom
}: iVideoContainer) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return isMeetingRoom ? (
    <video
      className={cn(
        "rounded border w-full h-auto max-h-[300px] object-cover",
        isLocalStream &&
          isOnCall &&
          "relative w-full h-auto max-h-[300px] border-primary-500"
      )}
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocalStream}
    />
  ) : (
    <video
      className={cn(
        "rounded border w-[800px]",
        isLocalStream &&
          isOnCall &&
          "w-[200px] h-auto absolute border-primary-100 border-2 bottom-4 right-4"
      )}
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocalStream}
    />
  );
};

export default VideoContainer;
