"use client";
import SwiperDetailPost from "@/components/shared/Swiper/SwiperDetailPost";
import { useUserContext } from "@/context/UserContext";
import { FileResponseDTO } from "@/lib/DTO/map";
import React, { useMemo, useState } from "react";
import CaptionInput from "./CaptionInput";
import CollaboratorSearch from "./CollaboratorSearch";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { mapFilesToDTO } from "@/lib/utils";

const PreCreate = ({
  files,
  remainContents = [],
  captionContent,
  taggedUser,
  setCaptionContent,
  setTaggedUser
}: {
  files: File[];
  remainContents?: FileResponseDTO[];
  captionContent: string;
  taggedUser?: ShortUserResponseDTO[];
  setCaptionContent: React.Dispatch<React.SetStateAction<string>>;
  setTaggedUser: React.Dispatch<React.SetStateAction<ShortUserResponseDTO[]>>;
}) => {
  const { adminInfo } = useUserContext();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const handleInputChange = (value: string) => {
    setCaptionContent(value);
  };
  const mergedFiles = useMemo(() => {
    const mappedNewFiles = mapFilesToDTO(files);
    return [...remainContents, ...mappedNewFiles];
  }, [files, remainContents]);
  return (
    <div className="w-full flex flex-grow items-center justify-center">
      {/* Ảnh hoặc video */}
      <div className="w-full h-full overflow-auto flex justify-center">
        <div className="grid gap-2 overflow-x-auto scrollbar-hide">
          <SwiperDetailPost contents={mergedFiles} />
        </div>
      </div>

      {/* Ô nhập nội dung */}
      <div className="w-full h-full px-4">
        {/* Header */}
        <div className="flex items-center h-[60px] space-x-3">
          <div className="flex w-7 h-7 rounded-full overflow-hidden">
            <img
              src={adminInfo.avatar}
              alt="avatar"
              className="w-full h-full object-cover "
            />
          </div>
          <span className="body-semibold text-dark100_light900">
            {adminInfo.firstName} {adminInfo.lastName}
          </span>
        </div>

        {/* Input Box */}
        <CaptionInput
          onCaptionChange={handleInputChange}
          captionContent={captionContent}
          setTyping={setIsTyping}
        />

        {/* Add Collaborators */}
        <div className="flex flex-grow items-center justify-between mt-4 border-t pt-3 border-light500_dark400 w-full">
          <CollaboratorSearch
            taggedUser={taggedUser}
            setTaggedUser={setTaggedUser}
          />
        </div>
      </div>
    </div>
  );
};

export default PreCreate;
