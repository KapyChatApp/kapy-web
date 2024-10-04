import React from "react";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react/dist/iconify.js";

interface globalSearchProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GlobalSearch = ({ onChange }: globalSearchProps) => {
  return (
    <div className="relative w-full mt-[16px] px-2">
      <div className="background-light800_dark200-search relative flex min-h-[36px] grow items-center gap-[12px] rounded-[10px] px-[16px] py-[8px]">
        <Icon
          icon="ic:baseline-search"
          width={18}
          height={18}
          className="text-dark100_light900 opacity-50 dark:opacity-80 cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search"
          className="paragraph-light text-dark100_light900 placeholder:opacity-50 placeholder:dark:opacity-80 no-focus background-light800_dark200 border-none shadow-none outline-none w-full h-full placeholder:paragraph-light p-[0px]"
          onChange={onChange}
        ></Input>
      </div>
    </div>
  );
};

export default GlobalSearch;
