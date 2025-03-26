import { Button } from "@/components/ui/button";
import { CommentResponseDTO } from "@/lib/DTO/comment";
import { formatTimeMessageBox } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import OtherPost from "../Other/OtherPost";
import { ShortUserResponseDTO } from "@/lib/DTO/user";

const CommentCard = ({
  item,
  setComments,
  onReply
}: {
  item: CommentResponseDTO;
  setComments: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  onReply: (user: ShortUserResponseDTO) => void;
}) => {
  const repliedInfo: ShortUserResponseDTO = {
    _id: item._id,
    firstName: item.firstName,
    lastName: item.lastName,
    nickName: item.nickName,
    avatar: item.avatar
  };
  return (
    <li className="flex w-full  pt-3 mt-[-5px] mr-[-2px]">
      <div className="flex justify-between items-start w-full">
        <div className="flex w-full h-fit items-start justify-center">
          <div className="flex items-start justify-center mr-[18px]">
            <div className="w-8 h-8">
              <a className="w-8 h-8" href={`/account/${item.userId}`}>
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    alt="ava"
                    src={item.avatar}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
            </div>
          </div>
          <div className="flex-grow w-full h-auto items-center justify-center flex-col">
            <div className="flex-grow w-full h-full items-center justify-center flex">
              <div className="w-fit h-full flex p-[2px]">
                <span className="w-full text-dark100_light900 body-semibold">
                  <a
                    className="w-fit transition-opacity duration-300 hover:opacity-40"
                    href={`/account/${item.userId}`}
                  >
                    {item.firstName + " " + item.lastName}
                  </a>
                </span>
              </div>

              <div className="flex-grow h-fit w-auto flex items-center justify-start ml-1">
                <h2 className="text-dark100_light900 body-regular items-center justify-start">
                  {item.caption}
                </h2>
              </div>
            </div>
            {item.content && (
              <div className="flex w-full h-fit items-center justify-start mt-1">
                <div
                  key={item.content._id}
                  className="w-24 h-36 relative group"
                >
                  {item.content.type.startsWith("image") ? (
                    <img
                      src={item.content.url}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={item.content.url}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                    />
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center justify-start mt-2 mb-1 w-fit h-fit relative">
              <span className="w-auto h-auto flex items-center justify-center">
                <div className="text-dark600_light600 mr-3 small-regular">
                  {formatTimeMessageBox(item.createAt)}
                </div>
                {item.likedIds.length > 0 && (
                  <div className="text-dark600_light600 mr-3 small-bold">
                    {item.likedIds.length} likes
                  </div>
                )}
                <div className="relative items-center justify-center flex">
                  <Button
                    className="p-0 bg-transparent shadow-none border-none h-fit w-fit mr-3"
                    onClick={() => onReply(repliedInfo)}
                  >
                    <p className="text-dark600_light600 small-bold">Reply</p>
                  </Button>
                  {/* ReportPost xuất hiện bên cạnh Reply */}
                  <div className="absolute left-full top-0 mt-[-2px] hidden group-hover:block ml-2">
                    <OtherPost comment={item} setComments={setComments} />
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
        <span className="flex-1 w-4 h-4 mt-[9px] cursor-pointer">
          <Icon
            icon="solar:heart-linear"
            width={16}
            height={16}
            className="text-dark100_light900 object-cover"
          />
        </span>
      </div>
    </li>
  );
};

export default CommentCard;
