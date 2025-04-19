import SwiperStyle from "@/components/shared/Swiper/Swiper";
import { PostResponseDTO } from "@/lib/DTO/post";
import React from "react";

const Content = ({ post }: { post: PostResponseDTO }) => {
  return (
    <div className="flex w-full h-fit items-center justify-start flex-col">
      <div className={`w-full h-fit flex-wrap `}>
        <p className="text-dark100_light900 body-regular">{post.caption}</p>
      </div>
      <div
        className={`w-full h-fit flex ${
          post.tags.length > 0 || post.contents.length > 0 ? "mb-2" : ""
        }`}
      >
        {post.tags.map((item, index) => (
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
      <div className="flex justify-center items-center w-full h-fit">
        <div className="w-[468px] h-fit">
          <SwiperStyle contents={post.contents} />
        </div>
      </div>
    </div>
  );
};

export default Content;
