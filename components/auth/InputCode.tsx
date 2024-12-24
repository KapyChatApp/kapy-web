import React from "react";
import { Input } from "../ui/input";

const InputCode = () => {
  return (
    <div className="border-light-500 border relative flex h-[80px] min-h-[36px] grow items-center w-[80px] max-w-[80px] bg-transparent focus-visible:border-primary-500">
      <Input
        className="bg-transparent border focus:outline-none ring-0 border-light-500 rounded-xl placeholder:text-dark600_light600 placeholder:paragraph-light px-2 py-1 w-full"
        type="number"
        // onChange={handleChange}
        // onBlur={handleEditToggle}
      />
    </div>
  );
};

export default InputCode;
