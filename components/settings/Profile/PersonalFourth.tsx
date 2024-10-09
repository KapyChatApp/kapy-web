import { Button } from "@/components/ui/button";
import { PersonalItemProps } from "@/types/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const PersonalFourth = ({ setEdit }: PersonalItemProps) => {
  const handleEdit = () => {
    setEdit(true);
  };
  return (
    <div className="flex flex-col items-start justify-start gap-3 w-full h-fit">
      <Button
        className="w-full h-full bg-transparent flex hover:bg-primary-200 dark:hover:bg-primary-500 gap-3 border-none shadow-none rounded-lg"
        onClick={handleEdit}
      >
        <Icon
          icon="iconamoon:edit"
          width={18}
          height={18}
          className="text-dark100_light900"
        />

        <p className="text-dark100_light900 paragraph-regular">Update</p>
      </Button>
    </div>
  );
};

export default PersonalFourth;
