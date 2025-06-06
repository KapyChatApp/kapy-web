"use client";
import InputCustom from "@/components/auth/InputCustom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useState } from "react";
import { UserLoginDTO, UserRegisterDTO } from "@/lib/DTO/user";
import { registerUser } from "@/lib/services/user/register";
import { SignInSchema } from "@/lib/validation";
import { getMyProfile } from "@/lib/data/mine/dataAdmin";
import { useUserContext } from "@/context/UserContext";
import { loginUser } from "@/lib/services/auth/login";
import { getDeviceInfo } from "@/lib/utils";

const Signup = () => {
  const { adminInfo, setAdminInfo } = useUserContext();
  const [isOtp, setIsOtp] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birth, setBirth] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const inputCustomItems = [
    { placeholder: "First name", value: firstName, setValue: setFirstName },
    { placeholder: "Last name", value: lastName, setValue: setLastName },
    { placeholder: "Email", value: email, setValue: setEmail },
    {
      placeholder: "PhoneNumber",
      value: phoneNumber,
      setValue: setPhoneNumber
    },
    { placeholder: "Birth", value: birth, setValue: setBirth },
    { placeholder: "Password", value: password, setValue: setPassword },
    { placeholder: "Gender", value: gender, setValue: setGender },
    {
      placeholder: "Confirmed password",
      value: confirmedPassword,
      setValue: setConfirmedPassword
    }
  ];
  const handleSignUp = async () => {
    try {
      const result = SignInSchema.safeParse({
        firstName,
        lastName,
        email,
        phoneNumber,
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
          setError(message);
          toast({
            title: `Error in ${field}`,
            description: message,
            className:
              "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
          });
        });
        return;
      }

      // Kiểm tra mật khẩu xác nhận
      if (password !== confirmedPassword) {
        toast({
          title: "Error",
          description: "Confirmed password does not match the password.",
          className:
            "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
        });
        setError("Confirmed password does not match the password.");
        return;
      }
      // Nếu không có lỗi, thực hiện logic tiếp theo
      const params: UserRegisterDTO = {
        firstName,
        lastName,
        nickName: "",
        phoneNumber,
        email,
        password,
        rePassword: confirmedPassword,
        gender: gender === "male",
        birthDay: birth
      };

      console.log(params);
      //Gửi yêu cầu đăng ký
      const response = await registerUser(params);
      if (response) {
        toast({
          title: "Success",
          description: "You have successfully signed up!",
          className:
            "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
        });
        const loginInfo: UserLoginDTO = {
          phoneNumber,
          password,
          ...getDeviceInfo()
        };
        const result = await loginUser(loginInfo);

        if (result.token === "") {
          setError("Login failed");
          toast({
            title: "Error",
            description: error,
            className:
              "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center"
          });
          return;
        }
        const token = result.token;
        const device = result.device;
        localStorage.setItem("token", token);
        localStorage.setItem("deviceId", device._id);

        await getMyProfile(setAdminInfo);

        window.location.href = "/";
      }
    } catch (error: any) {
      const errorMessage =
        error?.message || "An unexpected error occurred during sign-up.";

      toast({
        title: "Error",
        description: errorMessage,
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };

  return (
    <div className="flex flex-col items-start justify-center w-full h-fit gap-10 pb-5">
      <div className="flex flex-col gap-4 items-start justify-center w-full h-fit">
        <p className="text-primary-500 h1-bold">Welcome Back</p>
        <p
          className={`paragraph-light ${
            error ? "text-accent-red" : "text-dark100_light900"
          }`}
        >
          {error || "Please enter sign up details below"}
        </p>
      </div>

      <div className="flex flex-col w-full h-fit gap-6">
        <div className="flex flex-col gap-6 w-full h-fit">
          {inputCustomItems.slice(0, 4).map((item) => (
            <InputCustom
              placeholder={item.placeholder}
              value={item.value}
              setValue={item.setValue}
            />
          ))}
        </div>
        <div className="flex flex-row justify-between w-full h-fit items-center gap-6">
          <div className="flex flex-col gap-6 w-[50%] h-fit">
            {inputCustomItems.slice(4, 6).map((item) => (
              <InputCustom
                placeholder={item.placeholder}
                value={item.value}
                setValue={item.setValue}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6 w-[50%] h-fit">
            {inputCustomItems.slice(6, 8).map((item) => (
              <InputCustom
                placeholder={item.placeholder}
                value={item.value}
                setValue={item.setValue}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-start justify-center w-full h-fit">
        <Button
          className="border-none bg-primary-500 hover:bg-primary-500  shadow-none w-full h-full py-4 rounded-[20px]"
          onClick={handleSignUp}
        >
          <div className="w-full h-[30px] items-center justify-center flex">
            <p className="text-[20px] font-bold text-light-900 ">
              Create an account
            </p>
          </div>
        </Button>

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
  );
};

export default Signup;
