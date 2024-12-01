"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import MessageInput from "../MessageInput";
import { Button } from "../../ui/button";
import { FileContent, ResponseMessageDTO } from "@/lib/dataMessages";
import axios from "axios";
import { usePathname } from "next/navigation";
import { ResponseUserInfo } from "@/lib/dataUser";
import { useChatContext } from "@/context/ChatContext";
import { UserInfoBox } from "@/lib/dataBox";
import { getPusherClient } from "@/lib/pusher";
import { getFileFormat } from "@/lib/utils";
import MicRecorder from "mic-recorder-to-mp3";
import MessageRecorder from "../MessageRecorder";

interface BottomProps {
  recipientIds: string[] | undefined;
  senderInfo: UserInfoBox | undefined;
}
const tempSenderInfo = {
  id: "",
  firstName: "Default",
  lastName: " User",
  nickName: "defaultNick",
  avatar: "defaultAvatarUrl"
} as ResponseUserInfo;
const RightBottom = ({ recipientIds, senderInfo }: BottomProps) => {
  const { setMessagesByBox } = useChatContext();
  const pathname = usePathname();
  const boxId = pathname.split("/").pop();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const apiAdminId = localStorage.getItem("adminId");
  const [temporaryToCloudinaryMap, setTemporaryToCloudinaryMap] = useState<
    { tempUrl: string; cloudinaryUrl: string }[]
  >([]);
  const [record, setRecord] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

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

  const handleSendTextMessage = async () => {
    const newMessageSegment: ResponseMessageDTO = {
      id: "",
      flag: true,
      readedId: apiAdminId ? [apiAdminId] : [],
      contentId: [],
      text: [messageContent],
      boxId: boxId ? boxId : "",
      createAt: new Date().toISOString(),
      createBy: apiAdminId ? apiAdminId : ""
    };

    // Tạo đối tượng SegmentMessageDTO
    const recipientId = recipientIds ? recipientIds : [];
    const messageData = {
      boxId: boxId,
      content: messageContent
    };

    if (!messageData.boxId || recipientId.length === 0) {
      console.error("Missing required fields in message data");
      return;
    }

    // Gửi request đến API để gửi tin nhắn với file đã chọn
    if (messageContent !== "") {
      const formData = new FormData();
      formData.append("boxId", messageData.boxId);
      formData.append("content", JSON.stringify(messageData.content));

      // Gửi API
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        const response = await axios.post(
          process.env.BASE_URL + "message/send",
          formData,
          {
            headers: {
              Authorization: `${storedToken}`
            }
          }
        );
        setMessageContent("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    } else console.log("No text in input bar");
  };

  const handleSendMultipleFiles = async (files: File[]) => {
    if (!files.length || !boxId) return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      // Tạo danh sách fileContent và message tạm thời để hiển thị trước
      const tempMessages: ResponseMessageDTO[] = files.map((file) => ({
        id: "",
        flag: true,
        readedId: [apiAdminId || ""],
        contentId: [
          {
            fileName: file.name,
            url: URL.createObjectURL(file), // Preview URL tạm thời
            publicId: "",
            bytes: file.size.toString(),
            width: "0",
            height: "0",
            format: getFileFormat(file.type, file.name),
            type: file.type.split("/")[0]
          }
        ],
        text: [],
        boxId: boxId ? boxId : "",
        createAt: new Date().toISOString(),
        createBy: apiAdminId || ""
      }));

      // Gửi từng file lên server
      for (const file of files) {
        const fileContent: FileContent = {
          fileName: file.name,
          url: "",
          publicId: "", // Cloudinary Public ID
          bytes: file.size.toString(),
          width: "0",
          height: "0",
          format: getFileFormat(file.type, file.name),
          type: file.type.split("/")[0]
        };

        const formData = new FormData();
        console.log(file);
        formData.append("boxId", boxId);
        formData.append("content", JSON.stringify(fileContent));
        formData.append("file", file);

        await axios.post(`${process.env.BASE_URL}message/send`, formData, {
          headers: {
            Authorization: storedToken,
            "Content-Type": "multipart/form-data"
          }
        });
      }
    } catch (error) {
      console.error("Error sending files:", error);
    }
  };

  const handleSendRecorder = async (record: File) => {
    if (!boxId) return;
    setRecord(false);
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      // Tạo danh sách fileContent và message tạm thời để hiển thị trước
      const tempMessages: ResponseMessageDTO = {
        id: "",
        flag: true,
        readedId: [apiAdminId || ""],
        contentId: [
          {
            fileName: record.name,
            url: URL.createObjectURL(record), // Preview URL tạm thời
            publicId: "",
            bytes: record.size.toString(),
            width: "0",
            height: "0",
            format: getFileFormat(record.type, record.name),
            type: record.type.split("/")[0]
          }
        ],
        text: [],
        boxId: boxId ? boxId : "",
        createAt: new Date().toISOString(),
        createBy: apiAdminId || ""
      };

      const fileContent: FileContent = {
        fileName: record.name,
        url: "",
        publicId: "", // Cloudinary Public ID
        bytes: record.size.toString(),
        width: "0",
        height: "0",
        format: getFileFormat(record.type, record.name),
        type: record.type.split("/")[0]
      };

      const formData = new FormData();
      console.log(record);
      formData.append("boxId", boxId);
      formData.append("content", JSON.stringify(fileContent));
      formData.append("file", record);

      const response = await axios.post(
        `${process.env.BASE_URL}message/send`,
        formData,
        {
          headers: {
            Authorization: storedToken,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (response.status === 200) {
        setFile(null);
        setAudioUrl("");
        setRecord(false);
      }
    } catch (error) {
      console.error("Error sending files:", error);
    }
  };

  useEffect(() => {
    const handleNewMessage = (data: ResponseMessageDTO) => {
      console.log("Successfully received message: ", data);
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
    };
    const pusherClient = getPusherClient();
    pusherClient.subscribe(`private-${boxId}`);

    // Bind sự kiện với handler
    pusherClient.bind("new-message", handleNewMessage);

    // Cleanup khi component bị unmount hoặc boxId thay đổi
    // return () => {
    //   pusherClient.unsubscribe(`private-${boxId}`);
    //   pusherClient.unbind("new-message", handleNewMessage);
    // };
  }, [boxId, setMessagesByBox]);

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
          if (e.target.files) {
            handleSendMultipleFiles(Array.from(e.target.files));
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
            setMessageContent={setMessageContent}
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
            if (record && recorderRef.current && !audioUrl) {
              // Nếu đang ghi âm, dừng ghi âm trước
              try {
                const [buffer, blob] = await recorderRef.current
                  .stop()
                  .getMp3();
                const newFile = new File([blob], "recording.mp3", {
                  type: "audio/mp3"
                });
                setFile(newFile);
                setRecord(false);
                await handleSendRecorder(newFile);
              } catch (err) {
                console.error("Error stopping and sending recording:", err);
              }
            } else if (file) {
              // Nếu không đang ghi âm, gửi file đã có
              await handleSendRecorder(file);
            } else {
              // Nếu không có file, gửi tin nhắn văn bản
              await handleSendTextMessage();
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
