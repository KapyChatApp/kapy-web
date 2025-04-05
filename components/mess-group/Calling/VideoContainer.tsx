import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface iVideoContainer {
  stream: MediaStream | null;
  isLocalStream: boolean;
  isOnCall: boolean;
}
const VideoContainer = ({
  stream,
  isLocalStream,
  isOnCall
}: iVideoContainer) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
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
