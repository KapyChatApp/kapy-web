"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import MessageInput from "../MessageInput";
import { Button } from "../../ui/button";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useChatContext } from "@/context/ChatContext";
import { getPusherClient } from "@/lib/pusher";
import { getFileFormat, isCurrentPageBoxId } from "@/lib/utils";
import MicRecorder from "mic-recorder-to-mp3";
import MessageRecorder from "../MessageRecorder";
import { useUserContext } from "@/context/UserContext";
import { isTexting } from "@/lib/services/message/isTexting";
import { disableTexting } from "@/lib/services/message/disableTexting";
import { ResponseMessageDTO } from "@/lib/DTO/message";
import { handleSendRecorder } from "@/lib/services/message/send/sendRecord";
import { handleSendTextMessage } from "@/lib/services/message/send/sendText";
import { handleSendMultipleFiles } from "@/lib/services/message/send/sendMultipleFiles";
import { markMessageAsRead } from "@/lib/services/message/read-mark";

interface BottomProps {
  recipientIds: string[] | undefined;
  relation: string;
}

const RightBottom = ({ recipientIds }: BottomProps) => {
  const {
    dataChat,
    isTyping,
    setIsTyping,
    setMessagesByBox,
    setFileList,
    setReadStatusByBox
  } = useChatContext();
  const pathname = usePathname();
  const boxId = pathname.split("/").pop();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const { adminInfo } = useUserContext();
  const [temporaryToCloudinaryMap, setTemporaryToCloudinaryMap] = useState<
    { tempUrl: string; cloudinaryUrl: string }[]
  >([]);
  const [record, setRecord] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (value: string) => {
    setMessageContent(value);
  };
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Hàm khởi tạo recorder
  const recorderRef = useRef<MicRecorder | null>(null);
  const initializeRecorder = () => {
    if (!recorderRef.current) {
      recorderRef.current = new MicRecorder({ bitRate: 128 });
    }
  };

  // Hàm bắt đầu ghi âm
  const startRecording = () => {
    initializeRecorder();
    recorderRef.current
      ?.start()
      .then(() => {
        console.log("Recording started");
        setRecord(true);
      })
      .catch((err: any) => {
        console.error("Error starting recording:", err);
      });
  };
  // Hàm hủy ghi âm
  const cancelRecording = () => {
    if (!recorderRef.current) {
      console.error("Recorder is not initialized");
      return;
    }
    recorderRef.current.stop();
    console.log("Recording canceled");
    setRecord(false);
    setAudioUrl("");
    setFile(null);
  };

  const handleAction = async () => {
    if (boxId && boxId !== " ") {
      if (record && recorderRef.current && !audioUrl) {
        try {
          const [buffer, blob] = await recorderRef.current.stop().getMp3();
          const newFile = new File([blob], "recording.mp3", {
            type: "audio/mp3"
          });
          setFile(newFile);
          setRecord(false);
          await handleSendRecorder(
            newFile,
            boxId,
            setFile,
            setAudioUrl,
            setRecord,
            setError
          );
        } catch (err) {
          console.error("Error stopping and sending recording:", err);
        }
      } else if (file) {
        await handleSendRecorder(
          file,
          boxId,
          setFile,
          setAudioUrl,
          setRecord,
          setError
        );
      } else {
        await handleSendTextMessage(
          messageContent,
          boxId,
          recipientIds,
          setMessageContent,
          setError
        );
      }
    }
  };

  const handleReadMark = async (boxId: string) => {
    try {
      const success = await markMessageAsRead(boxId);
      if (success) {
        console.log("Message marked as read successfully.");
      } else {
        console.warn("Failed to mark message as read.");
      }
    } catch (error) {
      console.error("Error in handleReadMark:", error);
    }
  };
  //Create Texting/DisableTexting Event
  let avatar: string = "";
  useEffect(() => {
    const createTextingEvent = async () => {
      if (!boxId) return;
      const box = dataChat.filter((item) => item.id === boxId);
      if (isTyping) {
        if (dataChat && adminInfo._id && box.length > 0) {
          const user = box[0].memberInfo.filter(
            (item) => item._id === adminInfo._id
          );
          if (user && user.length > 0) {
            avatar = user[0].avatar;
          }
        }
        try {
          // Gọi API để thông báo người dùng đang nhập
          const result = await isTexting(boxId, avatar);
          console.log(result);
        } catch (error) {
          console.error("Error texting event:", error);
        }
      } else {
        if (dataChat && adminInfo._id && box.length > 0) {
          const user = box[0].memberInfo.filter(
            (item) => item._id === adminInfo._id
          );
          if (user && user.length > 0) {
            avatar = user[0].avatar;
          }
        }
        try {
          const result = await disableTexting(boxId, avatar);
          console.log(result);
        } catch (error) {
          console.error("Error texting event:", error);
        }
      }
    };

    createTextingEvent();
  }, [isTyping]);

  //Send Message
  useEffect(() => {
    const handleNewMessage = (data: ResponseMessageDTO) => {
      setMessagesByBox((prev) => {
        const currentMessages = prev[data.boxId] || [];
        // Chỉ cập nhật nếu tin nhắn thực sự mới
        if (!currentMessages.some((msg) => msg.id === data.id)) {
          return {
            ...prev,
            [data.boxId]: [...currentMessages, data]
          };
        }
        return prev; // Không thay đổi nếu tin nhắn đã tồn tại
      });
      if (isCurrentPageBoxId(data.boxId)) {
        handleReadMark(data.boxId);
      } else {
        setReadStatusByBox((prevState) => ({
          ...prevState,
          [data.boxId]: false
        }));
      }
      if (data.contentId) {
        setFileList((prev) => {
          const fileContent = prev[data.boxId] || [];
          // Chỉ cập nhật nếu tin nhắn thực sự mới
          if (!fileContent.some((msg) => msg.url === data.contentId.url)) {
            const updated = {
              ...prev,
              [data.boxId]: [...fileContent, data.contentId]
            };
            console.log("Updated fileList: ", updated);
            return updated;
          }
          return prev; // Không thay đổi nếu tin nhắn đã tồn tại
        });
      }
    };
    const pusherClient = getPusherClient();
    pusherClient.subscribe(`private-${boxId}`);

    // Bind sự kiện với handler
    pusherClient.bind("new-message", handleNewMessage);

    //Cleanup khi component bị unmount hoặc boxId thay đổi
    return () => {
      pusherClient.unsubscribe(`private-${boxId}`);

      pusherClient.unbind("new-message", handleNewMessage);
    };
  }, [isTyping]);

  useEffect(() => {
    if (temporaryToCloudinaryMap.length === 0) return;

    setMessagesByBox((prev: any) =>
      prev.map((msg: any) => {
        const mapEntry = temporaryToCloudinaryMap.find(
          (entry) => msg.contentId[0].url === entry.tempUrl
        );
        return mapEntry
          ? {
              ...msg,
              contentId: [{ ...msg.contentId[0], url: mapEntry.cloudinaryUrl }]
            }
          : msg;
      })
    );

    // Sau khi cập nhật xong, loại bỏ các URL đã xử lý
    setTemporaryToCloudinaryMap([]);
  }, [temporaryToCloudinaryMap]);

  return (
    <div className="flex flex-row bg-transparent items-center justify-start w-full">
      <div className="flex flex-row lg:gap-4 gap-3 items-center justify-center">
        {!record && (
          <>
            <Icon
              icon="carbon:add-filled"
              width={28}
              height={28}
              className="text-primary-500 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
            />
            <Button
              className="flex border-none shadow-none w-fit h-fit bg-transparent p-0"
              onClick={handleIconClick}
            >
              <Icon
                icon="basil:picture-solid"
                width={28}
                height={28}
                className="text-primary-500 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
              />
            </Button>
          </>
        )}
        <Button
          className="flex border-none shadow-none w-fit h-fit bg-transparent p-0"
          onClick={record ? cancelRecording : startRecording}
        >
          <Icon
            icon={record ? "ic:round-cancel" : "fluent:mic-record-28-filled"}
            width={28}
            height={28}
            className={`text-primary-500 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]`}
          />
        </Button>
      </div>
      {/* Input file ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
        onChange={(e) => {
          if (e.target.files && boxId) {
            handleSendMultipleFiles(
              Array.from(e.target.files),
              boxId,
              setError
            );
          }
        }}
      />
      {/* {selectedFile && (
        <div className="ml-4 text-sm text-gray-700">
          File đã chọn: {selectedFile.name}
        </div>
      )} */}
      <div
        className={`flex flex-col  ${
          record ? "w-full ml-2" : "w-[80.5%] lg:ml-[24px] ml-2"
        }`}
      >
        {record ? (
          <MessageRecorder
            audioUrl={audioUrl}
            setAudioUrl={setAudioUrl}
            recorderRef={recorderRef}
            setFile={setFile}
          />
        ) : (
          <MessageInput
            onMessageChange={handleInputChange}
            messageContent={messageContent}
            setTyping={setIsTyping}
            handleAction={handleAction}
          />
        )}
      </div>

      <div
        className={`flex items-center justify-start w-fit  ${
          record ? "ml-2" : "lg:ml-[16px] ml-1"
        }`}
      >
        <div
          className="flex items-center w-6 h-6 xl:w-[28px] xl:h-[28px] justify-start"
          onClick={async () => {
            await handleAction();
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await handleAction();
            }
          }}
        >
          <Icon
            icon="mynaui:send-solid"
            width={28}
            height={28}
            className="text-primary-500 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
          />
        </div>
      </div>
    </div>
  );
};

export default RightBottom;
