"use client";
import { FileResponseDTO } from "@/lib/DTO/map";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

const UploadFiles = ({
  files,
  setFiles
}: {
  files: FileResponseDTO[];
  setFiles: React.Dispatch<React.SetStateAction<FileResponseDTO[]>>;
}) => {
  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles: FileResponseDTO[] = Array.from(selectedFiles).map(
      (file) => ({
        _id: crypto.randomUUID(),
        fileName: file.name,
        url: URL.createObjectURL(file),
        bytes: file.size,
        width: 0,
        height: 0,
        format: file.name.split(".").pop() || "",
        type: file.type.split("/")[0] === "image" ? "Image" : "Video"
      })
    );

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (!droppedFiles) return;

    const newFiles: FileResponseDTO[] = Array.from(droppedFiles).map(
      (file) => ({
        _id: crypto.randomUUID(),
        fileName: file.name,
        url: URL.createObjectURL(file),
        bytes: file.size,
        width: 0,
        height: 0,
        format: file.name.split(".").pop() || "",
        type: file.type.split("/")[0] === "image" ? "Image" : "Video"
      })
    );

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
    <div className="flex w-full flex-grow items-center justify-center">
      <div
        className="p-6 flex flex-col items-center justify-center w-80 relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {files.length === 0 ? (
          <>
            {/* Wrapper chứa hai icon */}
            <div className="relative w-24 h-24 mb-4">
              {/* Photo Icon */}
              <div className="absolute bottom-4 right-7 flex items-center justify-center w-20 h-20 rotate-[-10deg]">
                <Icon
                  icon="proicons:photo"
                  className="w-16 h-16 text-dark100_light900"
                />
              </div>

              {/* Video Icon */}
              <div className="absolute bottom-0 right-0 flex items-center justify-center w-16 h-16 rotate-[10deg]">
                <div className="flex items-center justify-center w-16 h-16 background-light900_dark200 rounded-lg">
                  <Icon
                    icon="hugeicons:ai-video"
                    className="w-16 h-16 text-dark100_light900"
                  />
                </div>
              </div>
            </div>

            <p className="text-dark600_light500 mt-2 h3-medium">
              Drag photos and videos here
            </p>
          </>
        ) : (
          <div className="flex w-full justify-center">
            <div
              className={`grid gap-2 overflow-x-auto max-w-[300px] ${
                files.length === 1
                  ? "grid-cols-1"
                  : files.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
              style={{ maxHeight: "250px" }} // Giới hạn chiều cao, tạo thanh cuộn dọc
            >
              {files.map((file, index) => (
                <div key={index} className="w-20 h-20 relative group">
                  {file.type.includes("Image") ? (
                    <img
                      src={file.url}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                    />
                  )}
                  {/* Nút Xóa */}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-full"
                  >
                    <Icon
                      icon="iconoir:cancel"
                      width={14}
                      height={14}
                      className="text-light-500"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label
          htmlFor="file-upload-create"
          className="px-4 py-2 bg-primary-500 body-medium text-white rounded-lg cursor-pointer mt-7"
        >
          Select from computer
        </label>
        <input
          id="file-upload-create"
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default UploadFiles;
