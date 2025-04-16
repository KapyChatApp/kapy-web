import { PostResponseDTO } from "@/lib/DTO/post";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { FileSegment } from "../ui/file-segment";
import { FileResponseDTO } from "@/lib/DTO/map";
import { useRouter } from "next/navigation";

const PostGrid = ({ postData }: { postData: PostResponseDTO[] }) => {
  const renderFirstContent = (content: FileResponseDTO[]) => {
    if (content.length === 0) {
      <img
        src="/assets/images/icon.png"
        alt=""
        className="w-full h-full aspect-square object-cover rounded-md"
      />;
    } else {
      switch (content[0].type) {
        case "Image":
          return (
            <img
              src={content[0].url}
              alt=""
              className="w-full h-full aspect-square object-cover rounded-md"
            />
          );
        case "Video":
          return (
            <video
              src={content[0].url}
              className="w-full h-full aspect-square object-cover rounded-md"
              controls
            />
          );
        case "Audio":
          return (
            <div className="w-full h-full aspect-square flex items-center justify-center border-[0.25px] border-light-500 bg-transparent dark:bg-dark-400 rounded-md">
              <audio controls src={content[0].url} />
            </div>
          );
        default:
          return (
            <div className="flex flex-wrap w-full h-full items-center justify-center border-[0.25px] border-light-500 bg-transparent dark:bg-dark-400">
              <FileSegment
                fileName={content[0].fileName}
                url={content[0].url}
              />
            </div>
          );
      }
    }
  };
  const router = useRouter();
  return postData.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
      {postData.map((post) => {
        const hasMultipleContents = post.contents.length > 1;
        return (
          <div
            className="relative w-full h-96 cursor-pointer"
            onClick={() => router.push(`/community/${post._id}`)}
          >
            {renderFirstContent(post.contents)}

            {hasMultipleContents && (
              <div className="absolute top-2 right-2 p-1 rounded-full">
                <Icon
                  icon="fluent:square-multiple-24-filled"
                  width={20}
                  height={20}
                  className="text-white"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <div className="w-full items-center justify-center flex h-full">
      <span className="text-dark100_light900 paragraph-light italic">
        No Posts
      </span>
    </div>
  );
};

export default PostGrid;
