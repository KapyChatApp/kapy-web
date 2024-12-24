"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { UserUpdatePassRequest } from "@/lib/DTO/user";
import { sendOTP } from "@/lib/services/auth/send-otp";
import { verifyOTP } from "@/lib/services/auth/verify-otp";
import { findUserByPhone } from "@/lib/services/user/searchByPhone";
import { updateUserPassword } from "@/lib/services/user/updatePassword";
import { ChangePassword, ForgotPassword } from "@/lib/validation";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import bcrypt from "bcryptjs";

const FloatingLabelInput = ({ id, label, type, value, setValue }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (value === "") {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative mb-6">
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full border-b-2 bg-transparent p-2 transition-all duration-200 ${
          isFocused || value ? "pt-5" : "pt-2"
        }`}
        placeholder=" "
        required
      />
      <label
        htmlFor={id}
        className={`absolute left-2 transition-all duration-200 ${
          isFocused || value ? "top-0 text-xs" : "top-2 text-sm"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userExists = await findUserByPhone(phoneNumber);
      if (!userExists) {
        setErrorMessage("No user found with this phone number.");
        return;
      }
      await sendOTP(phoneNumber);
      setStep(2);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isOtpValid = await verifyOTP(phoneNumber, otp);
      if (!isOtpValid) {
        setErrorMessage("Invalid OTP. Please try again.");
        return;
      }
      setStep(3);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = ForgotPassword.safeParse({
      password,
      confirmedPassword
    });
    if (!result.success) {
      // Tạo một Map để lưu lỗi đầu tiên cho từng trường
      const fieldErrors = new Map<string, string>();

      result.error.errors.forEach((err) => {
        const field = err.path[0] as string; // Lấy tên trường từ `path`
        if (!fieldErrors.has(field)) {
          // Chỉ thêm lỗi đầu tiên của mỗi trường
          fieldErrors.set(field, err.message);
        }
      });

      // Quăng lỗi cho từng trường
      fieldErrors.forEach((message, field) => {
        setErrorMessage(message);
        toast({
          title: `Error in ${field}`,
          description: message,
          className:
            "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
        });
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedRePassword = await bcrypt.hash(confirmedPassword, 10);
    const updatedPassword: UserUpdatePassRequest = {
      password: hashedPassword,
      rePassword: hashedRePassword
    };

    try {
      const updateResult = await updateUserPassword(updatedPassword);
      toast({
        title: "Success",
        description: "Your password has been updated successfully!",
        className:
          "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
      });
      setStep(1);
      setErrorMessage("");
      router.push("/signin");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };
  const handleResendOTP = async () => {
    try {
      await sendOTP(phoneNumber);
    } catch (error) {
      setErrorMessage("resend failed. Please try again.");
    }
  };

  const handleBack = () => {
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col items-start justify-center w-full h-fit gap-[48px]">
      <div className="flex flex-col gap-4 items-start justify-center w-full h-fit">
        <p className="text-primary-500 h1-bold">Forgot Password</p>
        <p
          className={`${
            errorMessage ? "text-accent-red" : "text-dark100_ligh900"
          } paragraph-light`}
        >
          {errorMessage
            ? errorMessage
            : "No worries, we'll send you code to reset your password!"}
        </p>
      </div>

      <div className="flex flex-col w-full h-fit gap-3">
        {/* <div className="flex flex-col gap-6 w-full h-fit">
          {inputCustomItems.slice(0, 2).map((item) => (
            <InputCustom placeholder={item.placeholder} value={item.value} />
          ))}
        </div> */}
        {step === 1 && (
          <form onSubmit={handlePhoneSubmit}>
            <FloatingLabelInput
              id="phone"
              label="Phone Number"
              type="text"
              value={phoneNumber}
              setValue={setPhoneNumber}
            />
            <button
              type="submit"
              className="border-none bg-primary-500 hover:bg-primary-500  shadow-none w-full h-fit py-3 rounded-[20px] text-[18px] font-bold text-light-900"
            >
              Send OTP
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <FloatingLabelInput
              id="otp"
              label="Enter OTP"
              type="text"
              value={otp}
              setValue={setOtp}
            />
            <button
              type="submit"
              className="border-none bg-primary-500 hover:bg-primary-500  shadow-none w-full h-fit py-3 rounded-[20px] text-[18px] font-bold text-light-900"
            >
              Verify OTP
            </button>

            <p className="text-dark100_light500 mt-5 flex  text-sm">
              You haven&apos;t recieved OTP yet ?{" "}
              <p
                onClick={handleResendOTP}
                className="ml-2 cursor-pointer text-accent-red hover:underline"
              >
                Resend
              </p>
            </p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <FloatingLabelInput
              id="newPassword"
              label="New Password"
              type="password"
              value={password}
              setValue={confirmedPassword}
            />
            <FloatingLabelInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={password}
              setValue={confirmedPassword}
            />
            <button
              type="submit"
              className="border-none bg-primary-500 hover:bg-primary-500  shadow-none w-full h-fit py-3 rounded-[20px] text-[18px] font-bold text-light-900"
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="flex flex-col gap-6 items-start justify-center w-full h-fit">
          <div className="flex flex-row gap-3 justify-between items-center h-fit w-full">
            <div className="bg-light-500 h-[1px] w-full min-h-fit items-center justify-center"></div>
            <div className="flex h-full w-fit items-center justify-center">
              <p className="text-dark100_light900 paragraph-light ">or</p>
            </div>
            <div className="bg-light-500 h-[1px] w-full min-h-fit items-center justify-center"></div>
          </div>

          <div className="flex flex-col justify-center items-start w-full h-fit gap-4">
            <Button className="border border-light-500 bg-transparent shadow-none w-full h-fit py-4 rounded-[20px] gap-4">
              <Icon icon="logos:google-icon" width={30} height={30} />
              <p className="paragraph-medium text-dark100_light900">
                Continue with Google
              </p>
            </Button>
            <div className="flex flex-row gap-3 w-full items-center justify-center h-fit">
              <p className="text-dark100_light900 paragraph-light">
                You have an account?
              </p>
              <Link href="/signin">
                <p className="text-primary-500 paragraph-bold">Sign in</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
