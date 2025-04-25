import { useCallback, useEffect, useState } from "react";

interface UseGroupCallControlsProps {
  localStream: MediaStream | null;
  peer: any | any[]; // Có thể là 1 peer hoặc mảng các peer
  ongoingCall: any;
}

export const useMediaControls = ({
  localStream,
  peer,
  ongoingCall
}: UseGroupCallControlsProps) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);
  const [isScreenOn, setIsScreenOn] = useState(false);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const isOnCall = !!(localStream && peer && ongoingCall);

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVidOn(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleScreenShare = async () => {
    if (!localStream) return;

    const peers = Array.isArray(peer) ? peer : [peer];

    const videoSenders = peers.map((p) =>
      p?._pc
        ?.getSenders?.()
        .find((s: RTCRtpSender) => s.track?.kind === "video")
    );

    if (!isScreenOn) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        videoSenders.forEach((sender) => {
          if (sender) sender.replaceTrack(screenTrack);
        });

        const newStream = new MediaStream([
          screenTrack,
          ...localStream.getAudioTracks()
        ]);
        setCurrentStream(newStream);
        setIsScreenOn(true);

        screenTrack.onended = () => {
          const cameraTrack = localStream.getVideoTracks()[0];
          videoSenders.forEach((sender) => {
            if (sender) sender.replaceTrack(cameraTrack);
          });
          setCurrentStream(localStream);
          setIsScreenOn(false);
        };
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    }
  };

  useEffect(() => {
    if (localStream) {
      setCurrentStream(localStream);
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      setIsVidOn(videoTrack?.enabled ?? true);
      setIsMicOn(audioTrack?.enabled ?? true);
    }
  }, [localStream]);

  useEffect(() => {
    if (!peer || !localStream) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [peer, localStream]);

  return {
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
  };
};
