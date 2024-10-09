"use client";
import { LeftSidbarSettingProps } from "@/types/settings";
import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import { Button } from "@/components/ui/button";

const AccountSecurity = ({ setRenderRight }: LeftSidbarSettingProps) => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPass(e.target.value); // Cập nhật giá trị mật khẩu khi nhập
  };
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPass(e.target.value); // Cập nhật giá trị mật khẩu khi nhập
  };
  const handleConfirmedPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirm(e.target.value); // Cập nhật giá trị mật khẩu khi nhập
  };

  const handleCancel = () => {
    setCurrentPass("");
    setConfirm("");
    setNewPass("");
  };

  const handleUpdate = () => {
    console.log("Password updated:");
    setCurrentPass("");
    setConfirm("");
    setNewPass("");
  };
  return (
    <div className="flex flex-col w-full h-fit py-4 px-3 rounded-lg background-light900_dark400 items-start gap-8 justify-start">
      <div className="flex flex-col w-full h-fit items-start justify-center gap-4">
        <div className="flex flex-col w-full h-fit items-start justify-start gap-1">
          <p className="text-dark100_light900 paragraph-medium">
            Change password
          </p>
          <div className="flex flex-row gap-1 w-full h-fit items-start justify-start pl-2">
            <p className="text-dark100_light900 small-11-bold text-opacity-60">
              Note:
            </p>
            <p className="text-dark100_light900 small-11-regular text-opacity-60">
              Password includes letter, number and special character, minimum 8
              characters
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-start justify-start w-full h-fit">
          <div className="flex items-start justify-start w-full h-fit pl-2">
            <p className="text-dark100_light900 body-regular">
              Current password
            </p>
          </div>
          <div className="flex w-full h-fit">
            <PasswordInput
              value={currentPass}
              onChange={handleCurrentPasswordChange}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full h-fit items-start justify-center">
        <div className="flex flex-col gap-3 items-start justify-start w-full h-fit">
          <div className="flex items-start justify-start w-full h-fit pl-2">
            <p
              className={`${
                confirm !== "" && newPass !== confirm
                  ? "text-accent-red"
                  : "text-dark100_light900"
              }  body-regular`}
            >
              New password
            </p>
          </div>
          <div className="flex w-full h-fit">
            <PasswordInput value={newPass} onChange={handleNewPasswordChange} />
          </div>
        </div>
        <div className="flex flex-col gap-3 items-start justify-start w-full h-fit">
          <div className="flex items-start justify-start w-full h-fit pl-2">
            <p
              className={`${
                confirm !== "" && newPass !== confirm
                  ? "text-accent-red"
                  : "text-dark100_light900"
              }  body-regular`}
            >
              Confirmed-new password
            </p>
          </div>
          <div className="flex w-full h-fit">
            <PasswordInput
              value={confirm}
              onChange={handleConfirmedPasswordChange}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full h-fit justify-end items-center">
        <div className="flex flex-col md:flex-row gap-2 w-[60%] h-fit">
          <div className="flex w-[48%] h-full background-light700_dark500  rounded-lg">
            <Button
              className="flex py-2 w-full h-full bg-transparent border-none hover:bg-transparent shadow-none text-dark100_light900 body-medium"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
          <div className="flex w-[48%] h-full bg-primary-500 rounded-lg">
            <Button
              className="flex py-2 w-full h-full bg-transparent border-none hover:bg-transparent shadow-none text-light-900 body-medium"
              onClick={handleUpdate}
              disabled={
                !currentPass || !newPass || !confirm || newPass !== confirm
              }
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;
