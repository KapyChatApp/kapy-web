import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import Image from "next/image";
import React, { useEffect } from "react";

interface MemberRadioProps {
  id: string;
  ava: string;
  name: string;
  onSelect: (id: string) => void;
}

interface MemberList {
  member: MemberRadioProps;
}

const MemberRadio: React.FC<MemberList> = ({ member }) => {
  const { id, ava, name, onSelect } = member;

  return (
    <div
      className="flex items-center justify-start w-full gap-4 hover:bg-primary-100 hover:bg-opacity-10 py-2 pl-4 cursor-pointer"
      onClick={() => {
        const radioItem = document.getElementById(id);
        if (radioItem) {
          radioItem.click(); // Click radio item
        }
        onSelect(id); // Gọi hàm onSelect khi click vào div
      }}
    >
      <RadioGroupItem
        value={id}
        id={id}
        className="data-[state=checked]:bg-primary-500 border-light-600 dark:border-dark-500 border text-light-900 data-[state=checked]:border-none h-5 w-5"
      />
      <div className="flex flex-row gap-3 items-center justify-start">
        <Image
          src={ava !== "" ? ava : "/assets/ava/default.png"}
          alt=""
          width={36}
          height={36}
          className="rounded-full"
        />
        <p className="paragraph-15-regular text-dark100_light900">{name}</p>
      </div>
    </div>
  );
};

export default MemberRadio;
