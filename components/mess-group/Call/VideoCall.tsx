"use client";
import { useSocketContext } from "@/context/SocketContext";
import React, { useCallback, useEffect, useState } from "react";
import VideoContainer from "./VideoContainer";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

const VideoCall = () => {
  const { localStream, peer, ongoingCall, handleHangup, isCallEnded } =
    useSocketContext();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);
  const [isScreenOn, setIsScreenOn] = useState(false);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [callDuration, setCallDuration] = useState(0);
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

  console.log("ongoingCall", ongoingCall);
  console.log("peer", peer);
  useEffect(() => {
    if (localStream) {
      setCurrentStream(localStream); // Set the current stream to localStream
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      setIsVidOn(videoTrack?.enabled);
      setIsMicOn(audioTrack?.enabled);
    }
  }, [localStream]);
  useEffect(() => {
    if (!peer || !localStream) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [peer, localStream]);

  const formatTime = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

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

  const toggleScreenShare = async () => {
    if (!localStream) return;

    const videoSender = (peer as any)?._pc
      ?.getSenders?.()
      ?.find((s: RTCRtpSender) => s.track?.kind === "video");

    if (!isScreenOn) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (videoSender) {
          videoSender.replaceTrack(screenTrack);
        }

        // 👉 hiển thị stream màn hình trên giao diện local
        const newStream = new MediaStream([
          screenTrack,
          ...localStream.getAudioTracks()
        ]);
        setCurrentStream(newStream); // new state bạn sẽ thêm bên dưới

        setIsScreenOn(true);

        screenTrack.onended = () => {
          const cameraTrack = localStream.getVideoTracks()[0];

          if (videoSender) {
            videoSender.replaceTrack(cameraTrack);
          }

          setCurrentStream(localStream);
          setIsScreenOn(false);
        };
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    }
  };

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

export default VideoCall;
