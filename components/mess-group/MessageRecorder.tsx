"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import MicRecorder from "mic-recorder-to-mp3";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface RecorderProps {
  audioUrl: string;
  setAudioUrl: React.Dispatch<React.SetStateAction<string>>;
  recorderRef: React.MutableRefObject<MicRecorder | null>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const MessageRecorder = ({
  audioUrl,
  setAudioUrl,
  recorderRef,
  setFile
}: RecorderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState(true);

  // Tiến trình ghi âm
  useEffect(() => {
    let recordingInterval: NodeJS.Timeout | null = null;

    if (isRecording) {
      setRecordingProgress(0);
      recordingInterval = setInterval(() => {
        setRecordingProgress((prev) => (prev < 100 ? prev + 1 : 100));
      }, 100); // Tiến trình giả định
    } else {
      if (recordingInterval) {
        clearInterval(recordingInterval as NodeJS.Timeout);
        setRecordingProgress(0);
      }
    }

    return () => {
      if (recordingInterval) clearInterval(recordingInterval);
    };
  }, [isRecording]);

  // Hàm dừng ghi âm và lưu lại mp3
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current
        .stop()
        .getMp3()
        .then(([buffer, blob]) => {
          const file = new File([blob], "recording.mp3", { type: "audio/mp3" });
          setFile(file);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setIsRecording(false);
          setRecordingProgress(0); // Đặt lại progress ghi âm
        })
        .catch((err: any) => console.error("Error stopping recording:", err));
    }
  };

  // Hàm phát lại bản ghi âm
  const handleAudioPlay = () => {
    if (!audioUrl) return;
    const audio = audioRef.current;
    if (audio) {
      setIsPlaying(true);
      audio.currentTime = 0;
      audio.play();

      setPlaybackProgress(0);
      requestAnimationFrame(updatePlaybackProgress);
    }
  };

  // Hàm cập nhật tiến trình phát lại
  const updatePlaybackProgress = () => {
    const audio = audioRef.current;
    if (audio) {
      const duration = audio.duration; // Thời gian bản ghi âm
      const currentTime = audio.currentTime; // Thời gian phát lại thực tế

      // Điều chỉnh tốc độ tiến trình theo thời gian bản ghi âm
      const speedFactor = duration < 10 ? 1.2 : duration < 30 ? 1.0 : 0.8; // Tỷ lệ tốc độ (dựa trên độ dài bản ghi)
      let progress = (currentTime / duration) * 100 * speedFactor; // Tính tiến trình

      // Đảm bảo tiến trình không quá 100%
      if (progress > 100) {
        progress = 100;
      }

      // Điều chỉnh để bắt đầu chạy tiến trình trước khi bản ghi âm phát
      if (progress < 1) {
        // Nếu tiến trình nhỏ hơn 1%, bắt đầu từ 0.5 giây trước khi phát
        progress =
          currentTime + 0.5 * speedFactor > 100
            ? 100
            : ((currentTime + 0.5 * speedFactor) * 100) / duration;
      }

      // Cập nhật tiến trình
      setPlaybackProgress(progress);

      // Cập nhật tiếp tục khi chưa hết bài hát
      if (!audio.paused && !audio.ended) {
        requestAnimationFrame(updatePlaybackProgress);
      } else {
        setIsPlaying(false);
        setPlaybackProgress(0); // Đặt lại progress phát lại khi kết thúc
      }
    }
  };

  // Hàm dừng phát lại
  const handleAudioPause = () => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center bg-primary-500 w-full h-[36px] px-[16px] py-[9px] rounded-[20px] relative overflow-hidden">
        {/* Thanh tiến trình ghi âm */}
        {isRecording && (
          <div
            className="absolute top-0 left-0 h-full bg-dark-200 bg-opacity-20 transition-all"
            style={{ width: `${recordingProgress}%` }}
          />
        )}

        {/* Thanh tiến trình phát lại */}
        {!isRecording && audioUrl && isPlaying && (
          <div
            className="absolute top-0 left-0 h-full bg-dark-200 bg-opacity-20 transition-all"
            style={{ width: `${playbackProgress}%` }}
          />
        )}

        {/* Nút dừng ghi âm hoặc phát lại */}
        {audioUrl ? (
          <Button
            className="flex border-none shadow-none w-fit h-fit bg-transparent p-0 z-10"
            onClick={isPlaying ? handleAudioPause : handleAudioPlay}
          >
            <Icon
              icon={`${
                isPlaying ? "heroicons-solid:pause" : "heroicons-solid:play"
              }`}
              width={28}
              height={28}
              className="text-light-850 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
            />
          </Button>
        ) : (
          <Button
            className="flex border-none shadow-none w-fit h-fit bg-transparent p-0 z-10"
            onClick={stopRecording}
          >
            <Icon
              icon="heroicons-solid:stop"
              width={28}
              height={28}
              className="text-light-850 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
            />
          </Button>
        )}

        <audio
          ref={audioRef}
          src={audioUrl || undefined}
          className="hidden"
          onTimeUpdate={updatePlaybackProgress}
        />
      </div>
    </div>
  );
};

export default MessageRecorder;
