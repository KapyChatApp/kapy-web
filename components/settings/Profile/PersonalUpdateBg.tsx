"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useUserContext } from "@/context/UserContext";
import AvatarEditor from "react-avatar-editor";
import { uploadBackgroundClient } from "@/lib/services/user/updateBackground";
import { toast } from "@/hooks/use-toast";

interface Props {
  setUpdateBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setNewBackground: React.Dispatch<React.SetStateAction<string>>;
  editorRef: React.RefObject<AvatarEditor>;
}

const PersonalUpdateBg = ({
  setUpdateBackground,
  setNewBackground,
  editorRef
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setContainerSize(width);
      }
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect(); // Hủy đăng ký khi unmount
  }, []);

  const handleBack = () => {
    setUpdateBackground(false);
  };

  const handleUpdate = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas(); // Lấy canvas của ảnh đã cắt
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Xác định loại file dựa trên blob
          const fileType = blob.type || "image/*"; // Mặc định là "image/*" nếu không xác định được

          // Tạo File với loại dynamic
          const file = new File([blob], "avatar", { type: fileType });

          const result = await uploadBackgroundClient(file);

          if (result.status) {
            const temporaryUrl = URL.createObjectURL(blob);
            setNewBackground(temporaryUrl);
            setPreviewUrl("");
            setUpdateBackground(false);
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
      <div
        ref={containerRef}
        className="min-w-[400px] max-w-[400px] md:max-w-[520px] lg:w-[520px] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col"
      >
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

        <div className="flex flex-col h-[300px] w-full overflow-scroll scrollable p-4 gap-10">
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
            <div className="relative w-full h-full flex items-start justify-center">
              {/* AvatarEditor */}
              {containerSize > 0 && ( // Đảm bảo chỉ render khi đã có kích thước
                <AvatarEditor
                  ref={editorRef}
                  image={previewUrl}
                  width={containerSize} // Động
                  height={129} // Vuông
                  border={0}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={1}
                  rotate={0}
                  borderRadius={0}
                  className="relative z-10 w-full"
                />
              )}
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

        {
          <div className="flex justify-end w-full items-center pr-4 py-2">
            <div className="flex flex-row w-full h-fit gap-6 justify-end">
              <Button
                onClick={handleBack}
                className="paragraph-regular text-dark100_light900 py-2 px-3 rounded-lg background-light700_dark400 w-fit"
              >
                Cancel
              </Button>
              <Button
                className="bg-primary-500 hover:bg-primary-500 hover:bg-opacity-20 bg-opacity-20 text-primary-500 paragraph-regular py-2 px-3 rounded-lg w-fit"
                onClick={handleUpdate}
              >
                Update
              </Button>
            </div>
          </div>
        }
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

export default PersonalUpdateBg;
