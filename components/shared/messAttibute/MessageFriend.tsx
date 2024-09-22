import Image from "next/image";
import React from "react";

interface Content {
  text: string[];
  image: string[];
  link: string[];
}

interface Props {
  id: string;
  friend: string;
  ava: string;
  content: Content;
  createdAt: string;
  isOnline: boolean;
}

const MessageFriend = ({
  id,
  friend,
  ava,
  content,
  createdAt,
  isOnline
}: Props) => {
  return (
    <div className="flex flex-row items-start">
      {/* <div className="flex items-center bg-transparent relative flex-shrink-0 ">
        <Image
          src={`${ava}`}
          alt="ava"
          width={28}
          height={28}
          className="rounded-full"
        />
        {isOnline && (
          <div className="bg-green-600 rounded-full w-[10px] h-[10px] absolute bottom-0 right-0 translate-x-[-35%] translate-y-[5%]"></div>
        )}
      </div> */}
      <div className="bg-gray-200 p-3 rounded-lg max-w-xs shadow-md">
        {/* Hiển thị văn bản */}
        {content.text.map((text, index) => (
          <p key={index} className="text-sm text-black mb-1">
            {text}
          </p>
        ))}

        {/* Hiển thị hình ảnh */}
        {content.image.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            alt={`image-${index}`}
            className="w-full h-auto rounded-lg mb-2"
          />
        ))}

        {/* Hiển thị liên kết */}
        {content.link.map((link, index) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm underline"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
};

export default MessageFriend;
