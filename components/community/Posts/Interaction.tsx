import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
export const interationItem = [
  { icon: "solar:heart-linear", value: "react" },
  { icon: "lineicons:comment-1", value: "comment" },
  { icon: "f7:paperplane", value: "share" }
];

const Interaction = () => {
  return (
    <section className="flex justify-start items-center w-full h-fit my-1 ml-[-8px]">
      {interationItem.map((item) => (
        <span className="w-fit h-fit flex cursor-pointer p-2">
          <Icon
            icon={item.icon}
            width={24}
            height={24}
            className="text-dark100_light900"
          />
        </span>
      ))}
    </section>
  );
};

export default Interaction;
