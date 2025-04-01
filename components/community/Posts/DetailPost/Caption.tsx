import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { formatTimeMessageBox } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const CaptionCard = ({
  userId,
  avatar,
  accountName,
  caption,
  tags,
  createAt
}: {
  userId: string;
  avatar: string;
  accountName: string;
  caption: string;
  tags: ShortUserResponseDTO[];
  createAt: string;
}) => {
  return (
    <div className="flex w-full h-fit items-center justify-start">
      <li className="flex pt-[5px] mt-[-5px] mr-[-2px] pb-4 pr-4 w-full h-fit items-center justify-start">
        <div className="flex items-start justify-center">
          <div className="flex items-center justify-center mr-[14px]">
            <div className="w-8 h-8">
              <a href={`/account/${userId}`}>
                <div className="w-8 h-8 rounded-full relative overflow-hidden">
                  <Image alt="ava" src={avatar} fill className="object-cover" />
                </div>
              </a>
            </div>
          </div>
          <div className="flex-grow w-full h-auto items-center justify-center flex-col">
            <div className="flex w-full h-fit items-start p-[2px]">
              {/* Name */}
              <div className="w-fit h-full flex flex-shrink-0">
                <span className="text-dark100_light900 body-semibold">
                  <a
                    className="transition-opacity duration-300 hover:opacity-40"
                    href={`/account/${userId}`}
                  >
                    {accountName}
                  </a>
                </span>
              </div>

              {/* Caption */}
              <div className="flex-grow h-fit flex flex-col ml-2">
                <div className="w-full break-words whitespace-pre-wrap">
                  <h2 className="text-dark100_light900 body-regular break-all">
                    {caption}
                  </h2>
                </div>

                <div
                  className={`w-full h-fit flex flex-wrap ${
                    tags.length > 0 ? "pt-1" : ""
                  }`}
                >
                  {tags.map((item, index) => (
                    <div className="w-fit break-words whitespace-pre-wrap">
                      <a
                        className={`${index === 0 ? "" : "ml-2"}`}
                        href={`/account/${item._id}`}
                      >
                        <span
                          key={index}
                          className={`text-accent-blue body-regular break-all`}
                        >
                          @{item.firstName.trim()} {item.lastName}
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-start mt-2 mb-1 w-fit h-fit">
              <span className="w-auto h-auto flex items-center justify-center">
                <div className="text-dark600_light600 mr-3 small-regular">
                  {formatTimeMessageBox(createAt)}
                </div>
              </span>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};

export default CaptionCard;
