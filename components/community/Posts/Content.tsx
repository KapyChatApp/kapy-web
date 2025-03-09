import SwiperStyle from "@/components/shared/Swiper/Swiper";
import { PostResponseDTO } from "@/lib/DTO/post";
import React from "react";

const Content = ({ post }: { post: PostResponseDTO }) => {
  return (
    <div className="flex w-full h-fit items-center justify-start flex-col">
      <div className={`w-full h-fit flex-wrap ${post.caption ? "mb-2" : ""}`}>
        <p className="text-dark100_light900 body-regular">{post.caption}</p>
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
