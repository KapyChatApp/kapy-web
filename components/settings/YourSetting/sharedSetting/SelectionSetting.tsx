import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SelectionContent } from "@/types/settings";

interface SelectionProps {
  isSelected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  selectionData: SelectionContent[];
}

const SelectionSetting = ({
  isSelected,
  setSelected,
  selectionData
}: SelectionProps) => {
  return (
    <Select value={isSelected} onValueChange={(value) => setSelected(value)}>
      <SelectTrigger className="flex justify-between items-center gap-[6px]">
        <SelectValue
          placeholder={isSelected}
          className="body-regular text-dark100_light900"
        />
      </SelectTrigger>
      <SelectContent className="z-[100]">
        {selectionData.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            className="body-regular text-dark100_light900"
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectionSetting;
