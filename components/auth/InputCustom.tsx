"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { InputCustomProps } from "@/types/auth";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { genderList } from "@/constants/auth";

const InputCustom = ({ placeholder, value }: InputCustomProps) => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return placeholder === "Password" || placeholder === "Confirmed password" ? (
    <div className=" border-light-500 border-b relative flex h-[24px] min-h-[36px] grow items-center gap-[12px] w-full bg-transparent">
      <Input
        type={showPassword ? "text" : "password"}
        className="bg-transparent border-none focus:outline-none ring-0 border-light-500 border-b placeholder:text-dark600_light600 placeholder:paragraph-light px-2 py-1 w-full"
        placeholder={placeholder}
        //value={value}
        // onChange={onChange}
      />
      <Icon
        icon={showPassword ? "fluent:eye-12-filled" : "mingcute:eye-close-fill"}
        width={18}
        height={18}
        className="text-dark100_light900 opacity-60 cursor-pointer"
        onClick={togglePasswordVisibility}
      />
    </div>
  ) : placeholder === "Phone number" ? (
    <div className="border-light-500 border-b relative flex h-[24px] min-h-[36px] grow items-center w-full bg-transparent">
      <Input
        className="bg-transparent border-none focus:outline-none ring-0 border-light-500 border-b placeholder:text-dark600_light600 placeholder:paragraph-light px-2 py-1 w-full"
        type="number"
        placeholder={placeholder}
        // onChange={handleChange}
        // onBlur={handleEditToggle}
      />
    </div>
  ) : placeholder === "Birth" ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full p-0 justify-start text-left h-[24px] min-h-[36px] shadow-none",
            !date &&
              "text-dark100_light900 paragraph-light bg-transparent hover:bg-transparent shadow-none"
          )}
        >
          <div className="flex w-full rounded-md h-[24px] min-h-[36px]  items-center justify-between border-b border-light-500 bg-transparent py-1 px-2 shadow-none">
            {date ? (
              format(date, "PPP")
            ) : (
              <span className="text-dark600_light600 paragraph-light ">
                Pick a date
              </span>
            )}
            <CalendarIcon className="mr-1 h-4 w-4 text-dark600_light600 paragraph-regular" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col p-2 mr-2 border-none background-light900_dark200 text-dark100_light900 paragraph-regular">
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), parseInt(value)))
          }
        ></Select>
        <div className="rounded-md border text-dark100_light900 paragraph-regular">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  ) : placeholder === "Gender" ? (
    <div className="flex w-full h-fit border-b border-light500 bg-transparent">
      <Select>
        <SelectTrigger className="w-full bg-transparent focus border-none py-1 px-2 shadow-none">
          <SelectValue className="paragraph-regular text-dark100_light900" />
        </SelectTrigger>
        <SelectContent className="z-[20]">
          {genderList.map((item) => (
            <SelectItem
              key={item.key}
              value={item.key}
              className="paragraph-regular text-dark100_light900"
            >
              {item.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : (
    <div className="border-light-500 border-b relative flex h-[24px] min-h-[36px] grow items-center w-full bg-transparent">
      <Input
        className="bg-transparent border-none focus:outline-none ring-0 border-light-500 border-b placeholder:text-dark600_light600 placeholder:paragraph-light px-2 py-1 w-full"
        type="text"
        placeholder={placeholder}
        // onChange={handleChange}
        // onBlur={handleEditToggle}
      />
    </div>
  );
};

export default InputCustom;
