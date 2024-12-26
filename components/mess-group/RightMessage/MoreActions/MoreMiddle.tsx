"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SeeAllProps } from "@/types/mess-group";
import { useChatContext } from "@/context/ChatContext";
import { Fancybox } from "@fancyapps/ui";
import ReactPlayer from "react-player";
import { FileSegment } from "@/components/ui/file-segment";
import { FileContent, UserInfoBox } from "@/lib/DTO/message";
import { useUserContext } from "@/context/UserContext";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const MoreMiddle = ({
  setActiveComponent,
  setItemSent,
  detailByBox
}: SeeAllProps) => {
  const pathname = usePathname();
  const isGroup = /^\/group-chat\/[a-zA-Z0-9_-]+$/.test(pathname);
  const [boxId, setBoxId] = useState<string>("");
  const { fileList } = useChatContext();
  const [images, setImages] = useState<FileContent[]>([]);
  const [videos, setVideos] = useState<FileContent[]>([]);
  const [others, setOthers] = useState<FileContent[]>([]);
  const [members, setMembers] = useState<UserInfoBox[]>([]);
  const { isOnlineChat } = useUserContext();
  //boxId
  useEffect(() => {
    // Lấy đường dẫn hiện tại từ URL
    const path = window.location.pathname;
    // Chia đường dẫn thành các phần và lấy phần cuối cùng (boxId)
    const parts = path.split("/");
    const id = parts.pop(); // Lấy phần cuối cùng của đường dẫn

    if (id) {
      setBoxId(id); // Set boxId là chuỗi
    }
  }, [boxId]);

  useEffect(() => {
    if (boxId !== "" && fileList && fileList[boxId]) {
      const imageList = fileList[boxId].filter((item) => item.type === "Image");
      const videoList = fileList[boxId].filter((item) => item.type === "Video");
      const otherList = fileList[boxId].filter((item) => item.type === "Other");
      if (imageList) setImages(imageList);
      if (videoList) setVideos(videoList);
      if (otherList) setOthers(otherList);
    }
  });
  //Show image in more
  useEffect(() => {
    // Khởi tạo Fancybox sau khi DOM đã sẵn sàng
    Fancybox.bind("[data-fancybox='more-image']", {
      Toolbar: true,
      Thumbs: true
    });
    return () => {
      Fancybox.destroy();
    };
  }, []);

  //Show video in more
  useEffect(() => {
    // Khởi tạo Fancybox sau khi DOM đã sẵn sàng
    Fancybox.bind("[data-fancybox='more-video']", {
      Toolbar: true,
      Thumbs: true
    });
    return () => {
      Fancybox.destroy();
    };
  }, []);

  const handleSeeAllMember = () => {
    setActiveComponent("member");
    setItemSent(detailByBox.memberInfo);
  };
  const handleSeeAllPhoto = () => {
    setActiveComponent("photo");
    setItemSent(images);
  };
  const handleSeeAllVideo = () => {
    setActiveComponent("video");
    setItemSent(videos);
  };
  const handleSeeAllFile = () => {
    setActiveComponent("file");
    setItemSent(others);
  };

  return (
    <>
      <div
        className={`flex flex-col flex-1 items-center w-full ${
          isGroup
            ? "h-fit gap-[18px] justify-center mt-[24px] mb-[24px]"
            : "h-full justify-between pt-[12px] pb-3"
        }`}
      >
        {/* Members */}
        <div
          className={`${
            isGroup ? "flex" : "hidden"
          } flex-col items-center justify-start w-full h-fit gap-[14px]`}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-end">
              <p className="text-dark100_light900 paragraph-bold">Members</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 body-light ml-[8px]">
                {detailByBox.memberInfo.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Button
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
                onClick={handleSeeAllMember}
              >
                See all
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center w-full gap-[8px]">
            {detailByBox.memberInfo.length > 0
              ? // Sắp xếp members để leader đứng đầu
                detailByBox.memberInfo.slice(0, 3).map((item) => (
                  <div
                    className="flex flex-row items-center justify-start w-full gap-[12px]"
                    key={item._id}
                  >
                    <div className="relative flex-shrink-0 w-fit">
                      <Image
                        src={item.avatar}
                        alt="ava"
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                      {isOnlineChat[item._id] && (
                        <div className="bg-green-600 rounded-full w-[8px] h-[8px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
                      )}
                    </div>

                    <div className="flex flex-col bg-transparent items-start justify-start gap-[2px] flex-grow overflow-hidden min-w-0">
                      <p className="paragraph-15-regular h-fit text-dark100_light900">
                        {item.firstName + " " + item.lastName}
                      </p>
                      {/* <div className="flex items-center justify-start w-full min-w-0">
                            {item.addedBy === "" ? (
                              <p className="subtle-regular justify-start items-center text-primary-500 h-fit">
                                Leader
                              </p>
                            ) : (
                              <div className="flex items-center">
                                <p className="subtle-regular justify-start text-dark100_light900 h-fit">
                                  Added by
                                </p>
                                <p className="subtle-regular ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-dark100_light900 h-fit">
                                  {item.addedBy}
                                </p>
                              </div>
                            )}
                          </div> */}
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>

        {/* Photo */}
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-end">
              <p className="text-dark100_light900 paragraph-bold">Photo</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 body-light ml-[8px]">
                {images.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Button
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
                onClick={handleSeeAllPhoto}
              >
                See all
              </Button>
            </div>
          </div>
          <div className="flex flex-row items-center w-full md:justify-start md:gap-6 justify-around">
            {images.length > 0
              ? images.slice(0, 3).map((item) => (
                  <div className="flex md:w-[26%] sm:w-[36%] w-[30%] relative">
                    <a
                      href={item.url} // Thêm liên kết tới ảnh lớn
                      data-fancybox="more-image" // Kích hoạt Fancybox cho nhóm hình ảnh
                      className={`max-w-full h-auto cursor-pointer`}
                    >
                      <Image
                        src={item.url}
                        alt={item.fileName}
                        width={100}
                        height={100}
                        className="rounded-[4px] cursor-pointer"
                      />
                    </a>
                  </div>
                ))
              : null}
          </div>
        </div>

        {/* Video */}
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-end">
              <p className="text-dark100_light900 paragraph-bold">Video</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 body-light ml-[8px]">
                {videos.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Button
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
                onClick={handleSeeAllVideo}
              >
                See all
              </Button>
            </div>
          </div>
          <div className="flex flex-row items-center w-full md:justify-start md:gap-6 justify-around">
            {videos.length > 0
              ? videos.slice(0, 3).map((item) => (
                  <a
                    href={item.url}
                    data-fancybox="more-video"
                    className={` flex md:w-[30%] sm:w-[36%] w-[34%] relative cursor-pointer`}
                  >
                    <div className="rounded-[4px] overflow-hidden">
                      <ReactPlayer
                        url={item.url}
                        controls
                        width="200px"
                        height="100px"
                        className="max-w-full h-auto"
                      />
                    </div>
                  </a>
                ))
              : null}
          </div>
        </div>

        {/* File */}
        <div className="flex flex-col items-center justify-start w-full h-fit gap-[14px]">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="flex flex-row w-fit items-end">
              <p className="text-dark100_light900 paragraph-bold">File</p>
              <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 body-light ml-[8px]">
                {others.length}
              </p>
            </div>
            <div className="flex flex-grow items-center justify-end">
              <Button
                className="flex items-center justify-end text-dark100_light900 text-opacity-50 dark:text-opacity-80 small-custom underline bg-transparent shadow-none border-none p-0 w-fit"
                onClick={handleSeeAllFile}
              >
                See all
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-start w-full gap-[12px]">
            {others.length > 0
              ? others.slice(0, 3).map((item) => {
                  return (
                    <FileSegment
                      fileName={item.fileName}
                      url={item.url}
                      textClassName="text-dark100_light900"
                      iconClassName="text-dark100_light900"
                    />
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreMiddle;
