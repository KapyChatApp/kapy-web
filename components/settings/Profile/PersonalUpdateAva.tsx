"use client";
import React, { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import AvatarEditor from "react-avatar-editor";
import { uploadAvatarClient } from "@/lib/services/user/updateAva";
import { toast } from "@/hooks/use-toast";
import { UserUpdateRequest } from "@/lib/DTO/user";
import { Switch } from "@/components/ui/switch";

interface Props {
  setUpdateAva: React.Dispatch<React.SetStateAction<boolean>>;
  editorRef: React.RefObject<AvatarEditor>;
}

const PersonalUpdateAva = ({ setUpdateAva, editorRef }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPost, setIsPost] = useState(false);
  const { setNewAva } = useUserContext();
  const handleBack = () => {
    setUpdateAva(false);
  };

  const handleUpdate = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas(); // Lấy canvas của ảnh đã cắt
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Xác định loại file dựa trên blob
          const fileType = blob.type || "image/*"; // Mặc định là "image/*" nếu không xác định được

          // Tạo File với loại dynamic
          const file = new File([blob], "avatar", { type: fileType });

          const result = await uploadAvatarClient(file, isPost);

          if (result.status) {
            const temporaryUrl = URL.createObjectURL(blob);
            setNewAva(temporaryUrl);
            setPreviewUrl("");
            setUpdateAva(false);
            toast({
              title: "Your avatar is updated successfully!",
              className:
                "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
            });
          } else {
            toast({
              title: "Your avatar is not updated successfully!",
              className:
                "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
            });
          }
        } else {
          toast({
            title: "Failed to process the cropped image.",
            className:
              "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
          });
        }
      }, "image/*"); // Định nghĩa loại MIME là "image/*"
    } else {
      toast({
        title: "Please upload an image before updating!",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (
        ["image/png", "image/jpeg", "image/jpg"].includes(selectedFile.type)
      ) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile)); // Tạo URL để xem trước ảnh
      } else {
        alert("Please select a valid PNG, JPEG, or JPG file.");
      }
    }
  };
  return (
    <div className="modal-overlay">
      <div className="min-w-[376px] max-w-[376px] md:max-w-[400px] lg:w-[400px] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col">
        <div className="flex w-full justify-between px-4 pt-2 pb-4">
          <p className="text-dark100_light900 paragraph-semibold mt-2">
            Update your avatar
          </p>
          <Icon
            icon="iconoir:cancel"
            width={24}
            height={24}
            className="text-dark100_light900 cursor-pointer"
            onClick={handleBack}
          />
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex flex-col h-[440px] w-full overflow-scroll scrollable p-4 gap-4">
          <div className="flex flex-col items-start justify-start gap-3 w-full h-fit">
            <Button
              className="w-full h-full bg-transparent flex bg-primary-200 dark:bg-primary-500 hover:bg-primary-200 dark:hover:bg-primary-500 gap-3 border-none shadow-none rounded-lg p-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon
                icon="ep:upload-filled"
                width={18}
                height={18}
                className="text-dark100_light900"
              />
              <p className="text-dark100_light900 paragraph-regular">
                Upload from PC
              </p>
            </Button>
          </div>

          {previewUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Div nền */}
              <div className="absolute inset-0 flex items-center justify-center background-light700_dark200 bg-opacity-40"></div>

              {/* AvatarEditor */}
              <AvatarEditor
                ref={editorRef}
                image={previewUrl}
                width={330}
                height={330}
                border={0}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={1}
                rotate={0}
                borderRadius={125}
                style={{ borderRadius: "50%" }}
                className="relative z-10 w-full"
              />
            </div>
          ) : (
            <div
              className="flex items-center justify-center w-full h-full rounded-[8px] border-[0.5px] border-dashed border-dark-600 dark:border-light-600 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Icon
                  icon="ep:upload-filled"
                  width={36}
                  height={36}
                  className="text-primary-500"
                />

                <p className="paragraph-15-regular text-dark100_light900">
                  Upload from PC
                </p>
              </div>
            </div>
          )}
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex justify-between w-full items-center p-2">
          <div className="flex w-fit">
            <Switch
              id="post-avatar-mode"
              checked={isPost}
              onCheckedChange={(checked) => {
                if (checked) {
                  setIsPost(true);
                } else {
                  setIsPost(false);
                }
              }}
            />
            <span className="text-dark100_light900 small-light ml-1 italic">
              Wanna post new avatar ?
            </span>
          </div>
          <div className="flex flex-row w-fit h-fit gap-4 justify-end">
            <Button
              onClick={handleBack}
              className="paragraph-regular text-dark100_light900 py-2 px-3 rounded-lg background-light700_dark400 w-fit"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary-500 hover:bg-primary-500 hover:bg-opacity-20 bg-opacity-20 text-primary-500 paragraph-regular py-2 px-3 rounded-lg w-fit"
              onClick={handleUpdate}
              disabled={file ? false : true}
            >
              Update
            </Button>
          </div>
        </div>

        {/* Input file ẩn */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*" // Chỉ cho phép các định dạng PNG, JPEG, JPG
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default PersonalUpdateAva;
