"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/services/user/updateUser";
import { UserUpdateRequest } from "@/lib/DTO/user";
import { useUserContext } from "@/context/UserContext";

const adminInfoEdit = ({
  setIsEdit
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { setAdminInfo, adminInfo } = useUserContext();
  const birth = new Date(adminInfo.birthDay);
  const [firstName, setFirstName] = useState(adminInfo.firstName.trim());
  const [lastName, setLastName] = useState(adminInfo.lastName.trim());
  const [bio, setBio] = useState(adminInfo.bio);
  const [relationShip, setRelationShip] = useState(adminInfo.relationShip);
  const [job, setJob] = useState(adminInfo.job);
  const [hobbies, setHobbies] = useState(adminInfo.hobbies);
  const [gender, setGender] = useState(adminInfo.gender ? "male" : "female");
  const [birthDay, setBirthDay] = useState({
    day: birth.getDate(),
    month: birth.getMonth() + 1,
    year: birth.getFullYear()
  });
  const handleEdit = async () => {
    try {
      const formattedDate = new Date(
        `${birthDay.year}-${birthDay.month
          .toString()
          .padStart(2, "0")}-${birthDay.day.toString().padStart(2, "0")}`
      ).toISOString();
      const updatedProfile: UserUpdateRequest = {
        firstName,
        lastName,
        gender: gender === "male" ? true : false,
        birthDay: formattedDate,
        nickName: adminInfo.nickName,
        phoneNumber: adminInfo.phoneNumber,
        email: adminInfo.email,
        password: adminInfo.password,
        rePassword: adminInfo.password,
        address: adminInfo.address,
        bio,
        relationShip,
        job,
        hobbies
      };

      const result = await updateUserProfile(updatedProfile);
      console.log(result.newProfile);
      setAdminInfo(result.newProfile);

      toast({
        title: "Profile information is updated successfully!",
        className:
          "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
      });
      setIsEdit(false);
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description:
          "An error occurred while updating the profile. Please try again.",
        className:
          "border-none rounded-lg bg-red-500 text-white paragraph-regular items-center justify-center "
      });
    }
  };
  return (
    <div className="modal-overlay">
      <div className="min-w-[376px] max-w-[376px] md:max-w-[400px] lg:w-[400px] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col">
        <div className="flex w-full justify-between px-4 pt-2 pb-4">
          <p className="text-dark100_light900 paragraph-semibold mt-2">
            Edit your profile
          </p>
          <Icon
            icon="iconoir:cancel"
            width={24}
            height={24}
            className="text-dark100_light900 cursor-pointer"
            onClick={() => setIsEdit(false)}
          />
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex flex-col h-[440px] w-full overflow-scroll scrollable p-4 gap-4">
          <div className="flex flex-col gap-3 w-full h-fit">
            <p className="text-dark100_light900 body-regular">First name</p>
            <Input
              type="text"
              placeholder={adminInfo.firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="paragraph-regular text-dark100_light900 placeholder:opacity-50 placeholder:dark:opacity-80 no-focus bg-transparent border border-light-500 dark:border-dark-500 shadow-none outline-none w-full h-full placeholder:paragraph-regular rounded-lg p-2"
            ></Input>
          </div>
          <div className="flex flex-col gap-3 w-full h-fit">
            <p className="text-dark100_light900 body-regular">Last name</p>
            <Input
              type="text"
              placeholder={adminInfo.lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="paragraph-regular text-dark100_light900 placeholder:opacity-50 placeholder:dark:opacity-80 no-focus bg-transparent border border-light-500 dark:border-dark-500 shadow-none outline-none w-full h-full placeholder:paragraph-regular rounded-lg p-2"
            ></Input>
          </div>

          <div className="flex flex-row w-full h-fit justify-between items-center">
            <div className="flex flex-col gap-3 w-[46%] h-fit">
              <p className="text-dark100_light900 body-regular">Bio</p>
              <Input
                type="text"
                placeholder={
                  adminInfo.bio ? adminInfo.bio : "Enter your bio..."
                }
                onChange={(e) => setBio(e.target.value)}
                className="paragraph-regular text-dark100_light900 placeholder:opacity-50 placeholder:dark:opacity-80 no-focus bg-transparent border border-light-500 dark:border-dark-500 shadow-none outline-none w-full h-full placeholder:paragraph-regular rounded-lg p-2"
              ></Input>
            </div>
            <div className="flex flex-col gap-3 w-[46%] h-fit">
              <p className="text-dark100_light900 body-regular">Relationship</p>
              <Input
                type="text"
                placeholder={
                  adminInfo.relationShip ? adminInfo.relationShip : "Enter..."
                }
                onChange={(e) => setRelationShip(e.target.value)}
                className="paragraph-regular text-dark100_light900 placeholder:opacity-50 placeholder:dark:opacity-80 no-focus bg-transparent border border-light-500 dark:border-dark-500 shadow-none outline-none w-full h-full placeholder:paragraph-regular rounded-lg p-2"
              ></Input>
            </div>
          </div>

          <div className="flex flex-row w-full h-fit justify-between items-center">
            <div className="flex flex-col gap-3 w-[46%] h-fit">
              <p className="text-dark100_light900 body-regular">Job</p>
              <Input
                type="text"
                placeholder={
                  adminInfo.job ? adminInfo.job : "Enter your job..."
                }
                onChange={(e) => setJob(e.target.value)}
                className="paragraph-regular text-dark100_light900 placeholder:opacity-50 placeholder:dark:opacity-80 no-focus bg-transparent border border-light-500 dark:border-dark-500 shadow-none outline-none w-full h-full placeholder:paragraph-regular rounded-lg p-2"
              ></Input>
            </div>
            <div className="flex flex-col gap-3 w-[46%] h-fit">
              <p className="text-dark100_light900 body-regular">Hobbies</p>
              <Input
                type="text"
                placeholder={adminInfo.hobbies ? adminInfo.hobbies : "Enter..."}
                onChange={(e) => setHobbies(e.target.value)}
                className="paragraph-regular text-dark100_light900 placeholder:opacity-50 placeholder:dark:opacity-80 no-focus bg-transparent border border-light-500 dark:border-dark-500 shadow-none outline-none w-full h-full placeholder:paragraph-regular rounded-lg p-2"
              ></Input>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full h-fit">
            <p className="text-dark100_light900 body-semibold">
              adminInfo information
            </p>
            <RadioGroup
              defaultValue={gender}
              onValueChange={setGender}
              className="flex flex-row gap-12 w-full h-fit"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value="male"
                  id="male"
                  className="data-[state=checked]:bg-primary-500 border-light-600 dark:border-dark-500 border text-light-900 data-[state=checked]:border-none h-5 w-5"
                />
                <p className="text-dark100_light900 body-regular">Male</p>
              </div>
              <div className="flex items-center justify-start gap-3">
                <RadioGroupItem
                  value="female"
                  id="female"
                  className="data-[state=checked]:bg-primary-500 border-light-600 dark:border-dark-500 border text-light-900 data-[state=checked]:border-none h-5 w-5"
                />
                <p className="text-dark100_light900 body-regular">Female</p>
              </div>
            </RadioGroup>
            <div className="flex flex-col gap-3 w-full h-fit">
              <p className="text-dark100_light900 body-regular">Birthdate</p>
              <div className="flex flex-row gap-3 w-full h-fit">
                <Select
                  value={birthDay.day.toString()}
                  onValueChange={(value) =>
                    setBirthDay((prev) => ({ ...prev, day: Number(value) }))
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue
                      placeholder={birth.getDate().toString()}
                      className="body-regular text-dark100_light900"
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[20]">
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem
                        key={i + 1}
                        value={(i + 1).toString()}
                        className="body-regular text-dark100_light900"
                      >
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={birthDay.month.toString()}
                  onValueChange={(value) =>
                    setBirthDay((prev) => ({ ...prev, month: Number(value) }))
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue
                      placeholder={(birth.getMonth() + 1).toString()}
                      className="body-regular text-dark100_light900"
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[20]">
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem
                        key={i + 1}
                        value={(i + 1).toString()}
                        className="body-regular text-dark100_light900"
                      >
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={birthDay.year.toString()}
                  onValueChange={(value) =>
                    setBirthDay((prev) => ({ ...prev, year: Number(value) }))
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue
                      placeholder={birth.getFullYear().toString()}
                      className="body-regular text-dark100_light900"
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[20]">
                    {Array.from({ length: 125 }, (_, i) => (
                      <SelectItem
                        key={1900 + i}
                        value={(1900 + i).toString()}
                        className="body-regular text-dark100_light900"
                      >
                        {1900 + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex justify-end w-full items-center pr-4 py-2">
          <div className="flex flex-row w-full h-fit gap-6 justify-end">
            <Button
              onClick={() => setIsEdit(false)}
              className="paragraph-regular text-dark100_light900 py-2 px-3 rounded-lg background-light700_dark400 w-fit"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary-500 hover:bg-primary-500 hover:bg-opacity-20 bg-opacity-20 text-primary-500 paragraph-regular py-2 px-3 rounded-lg w-fit"
              onClick={handleEdit}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default adminInfoEdit;
