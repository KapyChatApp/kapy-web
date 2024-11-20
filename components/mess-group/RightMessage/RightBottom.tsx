"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MessageInput from "../MessageInput";
import { Button } from "../../ui/button";
import { UserInfo } from "@/lib/dataUser";
import {
  FileContent,
  GPSContent,
  ResponseMessageDTO
} from "@/lib/dataMessages";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";
import { usePathname } from "next/navigation";

interface BottomProps {
  recipientIds: string[] | undefined;
  boxId: string | undefined;
  setMessageSegment: React.Dispatch<React.SetStateAction<ResponseMessageDTO[]>>;
  senderInfo: UserInfo | undefined;
}
const tempSenderInfo = {
  id: "",
  fullName: "Default User",
  nickName: "defaultNick",
  avatar: "defaultAvatarUrl"
} as UserInfo;
const RightBottom = ({
  recipientIds,
  boxId,
  setMessageSegment,
  senderInfo
}: BottomProps) => {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const apiAdminId = localStorage.getItem("adminId");

  const handleInputChange = (value: string) => {
    setMessageContent(value); // Cập nhật giá trị khi input thay đổi
  };
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const crypto = require("crypto");
      const axios = require("axios");

      // Thông tin API Cloudinary
      const apiSecret = "V7HGA8m4YIWxSOC2oRRggDwBsvg"; // Thay bằng API Secret của bạn
      const apiKey = "539923817936375"; // Thay bằng API Key của bạn
      const cloudName = "dqiscnurh"; // Thay bằng Cloud Name của bạn
      const uploadPreset = "Avatar"; // Preset của bạn

      // Lấy timestamp (số)
      const timestamp = Math.floor(Date.now() / 1000); // Tạo timestamp

      // Tạo chuỗi chữ ký đúng
      const signatureString = `timestamp=${timestamp}&upload_preset=${uploadPreset}`;

      // Tạo chữ ký
      const signature = crypto
        .createHash("sha1")
        .update(signatureString + apiSecret)
        .digest("hex");

      // Tạo FormData để gửi tệp
      const formImage = new FormData();
      formImage.append("file", file); // file là đối tượng file bạn muốn upload
      formImage.append("upload_preset", uploadPreset);
      formImage.append("timestamp", timestamp.toString());
      formImage.append("signature", signature);
      formImage.append("api_key", apiKey);

      try {
        // Gửi yêu cầu POST tới Cloudinary
        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formImage,
          {
            headers: {
              "Content-Type": "multipart/form-data" // Đảm bảo loại nội dung là multipart/form-data
            }
          }
        );

        // Lấy URL của ảnh đã upload
        const uploadedFileUrl = uploadResponse.data.secure_url;

        const fileContent: FileContent = {
          fileName: file.name,
          url: uploadedFileUrl,
          publicId: uploadResponse.data.public_id,
          bytes: file.size.toString(),
          width: "0", // Thay đổi nếu cần
          height: "0", // Thay đổi nếu cần
          format: file.type.split("/")[1], // Lấy phần đuôi format từ type
          type: file.type.split("/")[0]
        };

        const newMessageSegment = {
          id: "",
          flag: true,
          readedId: apiAdminId ? [apiAdminId] : [],
          contentId: [fileContent],
          text: [],
          createAt: new Date().toISOString(),
          createBy: apiAdminId ? apiAdminId : "",
          infoCreateBy: senderInfo ? senderInfo : tempSenderInfo
        };
        console.log(newMessageSegment);

        // Tạo đối tượng RequestSendMessageDTO
        const recipientId = recipientIds ? recipientIds : [];
        const messageData = {
          boxId: boxId,
          content: fileContent
        };

        if (!messageData.boxId || recipientId.length === 0) {
          console.error("Missing required fields in message data");
          return;
        }

        // Gửi request đến API để gửi tin nhắn với file đã chọn
        const formData = new FormData();
        formData.append("boxId", messageData.boxId);
        formData.append("content", JSON.stringify(messageData.content));
        formData.append("file", file);

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
          console.log("Response from API: ", response.data);

          setMessageSegment((prevSegments) => [
            ...prevSegments,
            newMessageSegment
          ]);
        } catch (error) {
          console.error("Error sending message: ", error);
        }
      } catch (error) {
        console.error("Error uploading file or sending message: ", error);
      }
    }
  };
  const handleSend = async () => {
    const newMessageSegment = {
      id: "",
      flag: true,
      readedId: apiAdminId ? [apiAdminId] : [],
      contentId: [],
      text: [messageContent],
      createAt: new Date().toISOString(),
      createBy: apiAdminId ? apiAdminId : "",
      infoCreateBy: senderInfo ? senderInfo : tempSenderInfo
    };

    console.log("Detail of message:", newMessageSegment);

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

      // Thêm tin nhắn mới vào mảng
      setMessageSegment((prevSegments) => [...prevSegments, newMessageSegment]);
      setMessageContent("");
      console.log("Send successfully");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  // useEffect(() => {
  //   pusherClient.subscribe(`private-${boxId}`);

  //   pusherClient.bind("new-message", (data: string) => {
  //     console.log("Success fully: ", data);
  //   });

  //   return () => {
  //     pusherClient.unsubscribe(`private-${boxId}`);
  //     pusherClient.unbind("new-message", (data: string) => {
  //       console.log("Success fully: ", data);
  //     });
  //   };
  // });
  useEffect(() => {
    // Hàm xử lý sự kiện
    const handleNewMessage = (data: string) => {
      console.log("Successfully received message: ", data);
    };

    // Subscribe vào kênh riêng
    pusherClient.subscribe(`private-${boxId}`);

    // Bind sự kiện với handler
    pusherClient.bind("new-message", handleNewMessage);

    // Cleanup khi component bị unmount hoặc boxId thay đổi
    return () => {
      pusherClient.unsubscribe(`private-${boxId}`);
      pusherClient.unbind("new-message", handleNewMessage);
    };
  }, [boxId]);
  return (
    <div className="flex flex-row bg-transparent items-center justify-start w-full">
      <div className="flex flex-row lg:gap-4 gap-3 items-center justify-center">
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
        <Icon
          icon="fluent:mic-record-28-filled"
          width={28}
          height={28}
          className="text-primary-500 cursor-pointer lg:w-[28px] lg:h-[28px] w-[22px] h-[22px]"
        />
      </div>
      {/* Input file ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {selectedFile && (
        <div className="ml-4 text-sm text-gray-700">
          File đã chọn: {selectedFile.name}
        </div>
      )}
      <div className="flex flex-col lg:ml-[24px] ml-2 w-[80.5%] ">
        <MessageInput
          onMessageChange={handleInputChange}
          messageContent={messageContent}
          setMessageContent={setMessageContent}
        />
      </div>

      <div className="flex items-center justify-start w-fit lg:ml-[16px] ml-1">
        <div
          className="flex items-center w-6 h-6 xl:w-[28px] xl:h-[28px] justify-start"
          onClick={handleSend}
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
