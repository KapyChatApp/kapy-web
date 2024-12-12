"use clien";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import PersonalFirst from "../Profile/PersonalFirst";
import PersonalSecond from "../Profile/PersonalSecond";
import PersonalThird from "../Profile/PersonalThird";
import PersonalFourth from "../Profile/PersonalFourth";
import PersonalEdit from "./PersonalEdit";
import { Toaster } from "@/components/ui/toaster";
import { useUserContext } from "@/context/UserContext";
interface PersonalProps {
  setPersonal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PersonalAccount = ({ setPersonal }: PersonalProps) => {
  const [isEdit, setEdit] = useState(false);
  const { adminInfo } = useUserContext();
  const handleBack = () => {
    setPersonal(false);
  };
  return (
    <>
      <div className="modal-overlay">
        <div className="min-w-[400px] max-w-[400px] md:max-w-[520px] lg:w-[520px] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col gap-4 pb-4">
          <div className="flex w-full justify-between px-4 pt-2">
            <p className="text-dark100_light900 paragraph-semibold mt-2">
              Information of account
            </p>
            <Button
              className="flex bg-transparent shadow-none p-0 border-none hover:bg-transparent h-full w-fit"
              onClick={handleBack}
            >
              <Icon
                icon="iconoir:cancel"
                width={24}
                height={24}
                className="text-dark100_light900"
              />
            </Button>
          </div>

          {/*Background-Ava-Name*/}
          <PersonalFirst personal={adminInfo} setEdit={setEdit} />

          <div className="flex flex-col gap-4 w-full h-fit px-4">
            <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

            {/*Information*/}
            <PersonalSecond personal={adminInfo} setEdit={setEdit} />

            <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

            {/*Picture*/}
            <PersonalThird personal={adminInfo} setEdit={setEdit} />

            <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

            <PersonalFourth personal={adminInfo} setEdit={setEdit} />
          </div>
        </div>
      </div>
      {isEdit && <PersonalEdit personal={adminInfo} setEdit={setEdit} />}
      <Toaster />
    </>
  );
};
