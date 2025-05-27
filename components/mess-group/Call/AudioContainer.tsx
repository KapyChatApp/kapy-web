"use client";
import React, { useEffect, useRef } from "react";
interface iAudioContainer {
  stream: MediaStream | null;
  isLocalStream: boolean;
}
const AudioContainer = ({ stream, isLocalStream }: iAudioContainer) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;

      audioRef.current
        .play()
        .then(() => console.log("🎥 audio playback started"))
        .catch((err) => console.warn("❌ Cannot autoplay audio:", err));

      const tracks = stream.getAudioTracks();
      if (tracks.length === 0) {
        console.warn("⚠️ Stream has no audio tracks");
      } else {
        console.log("✅ Stream has audio tracks:", tracks);
      }
    }
  }, [stream]);
  return (
    <audio
      ref={audioRef}
      autoPlay
      className="hidden"
      muted={isLocalStream}
      playsInline
    />
  );
};

export default AudioContainer;
