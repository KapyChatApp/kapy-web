"use client";
import { FileResponseDTO } from "@/lib/DTO/map";
import { mapFilesToDTO } from "@/lib/utils";
import { Icon } from "@iconify/react";
import React, { useMemo } from "react";

const UploadFiles = ({
  files,
  setFiles,
  remainContents,
  setRemainContents
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  remainContents?: FileResponseDTO[];
  setRemainContents?: React.Dispatch<React.SetStateAction<FileResponseDTO[]>>;
}) => {
  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const removeOldContent = (id: string) => {
    setRemainContents?.((prev) => prev.filter((content) => content._id !== id));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (!droppedFiles) return;
    setFiles((prevFiles) => [...prevFiles, ...Array.from(droppedFiles)]);
  };

  const mergedContents = useMemo(() => {
    const oldItems =
      remainContents?.map((c) => ({ type: "old" as const, data: c })) ?? [];

    const newItems = files.map((file, index) => ({
      type: "new" as const,
      data: file,
      index
    }));

    return [...oldItems, ...newItems];
  }, [files, remainContents]);

  return (
    <div className="flex w-full flex-grow items-center justify-center">
      <div
        className="p-6 flex flex-col items-center justify-center w-fit relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {mergedContents.length === 0 ? (
          <>
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute bottom-4 right-7 w-20 h-20 rotate-[-10deg]">
                <Icon
                  icon="proicons:photo"
                  className="w-16 h-16 text-dark100_light900"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 rotate-[10deg]">
                <div className="w-16 h-16 background-light900_dark200 rounded-lg flex items-center justify-center">
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
                mergedContents.length === 1
                  ? "grid-cols-1"
                  : mergedContents.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
              style={{ maxHeight: "250px" }} // Giới hạn chiều cao, tạo thanh cuộn dọc
            >
              {mergedContents.map((item, i) => {
                if (item.type === "old") {
                  return (
                    <div key={i} className="w-20 h-20 relative group">
                      {item.data.type === "Image" ? (
                        <img
                          src={item.data.url}
                          alt="old"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={item.data.url}
                          className="w-full h-full object-cover rounded-lg"
                          controls
                        />
                      )}
                      <button
                        onClick={() => removeOldContent(item.data._id)}
                        className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-full"
                      >
                        <Icon icon="iconoir:cancel" width={14} height={14} />
                      </button>
                    </div>
                  );
                } else {
                  const fileURL = URL.createObjectURL(item.data);
                  return (
                    <div key={i} className="w-20 h-20 relative group">
                      {item.data.type.startsWith("image") ? (
                        <img
                          src={fileURL}
                          alt="new"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={fileURL}
                          className="w-full h-full object-cover rounded-lg"
                          controls
                        />
                      )}
                      <button
                        onClick={() => removeFile(item.index)}
                        className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-full"
                      >
                        <Icon icon="iconoir:cancel" width={14} height={14} />
                      </button>
                    </div>
                  );
                }
              })}
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
