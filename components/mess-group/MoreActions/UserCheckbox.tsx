import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import React from "react";
interface UserCheckboxProps {
  id: string;
  ava: string;
  name: string;
}

interface UserList {
  user: UserCheckboxProps;
}

const UserCheckbox: React.FC<UserList> = ({ user }) => {
  const { id, ava, name } = user;
  return (
    <div
      className="flex items-center justify-start w-full gap-4 hover:bg-primary-100 hover:bg-opacity-10 py-2 pl-4 cursor-pointer"
      onClick={() => {
        const checkItem = document.getElementById(id);
        if (checkItem) {
          checkItem.click(); // Click the radio item if it exists
        }
      }}
    >
      <Checkbox
        value={id}
        id={id}
        className="data-[state=checked]:bg-primary-500 border-light-600 dark:border-dark-500 border data-[state=checked]:text-light-900 data-[state=checked]:border-none h-5 w-5 rounded-full"
      />
      <div className="flex flex-row gap-3 items-center justify-start">
        <Image
          src={ava}
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

export default UserCheckbox;
