"use client";
import InputCustom from "@/components/auth/InputCustom";
import { Button } from "@/components/ui/button";
import { inputCustomItems } from "@/constants/auth";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useState } from "react";

const Signin = () => {
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: phone,
          password: pass
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
        return;
      }

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("phone", phone);

      window.location.href = "/chat";
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    }
  };
  return (
    <div className="flex flex-col items-start justify-center w-full h-fit gap-[48px]">
      <div className="flex flex-col gap-4 items-start justify-center w-full h-fit">
        <p className="text-primary-500 h1-bold">Welcome Back</p>
        <p
          className={`paragraph-light ${
            error ? "text-accent-red" : "text-dark100_light900"
          }`}
        >
          {error || "Please enter log in details below"}
        </p>
      </div>

      <div className="flex flex-col w-full h-fit gap-3">
        <div className="flex flex-col gap-6 w-full h-fit">
          {inputCustomItems.slice(0, 2).map((item, index) => (
            <InputCustom
              key={index}
              placeholder={item.placeholder}
              value={item.value}
              setPhone={setPhone}
              setPass={setPass}
            />
          ))}
        </div>
        <Link
          href="/forget-password"
          className="flex items-center justify-end w-full h-fit "
        >
          <p className="text-dark100_light900 paragraph-light italic">
            Forget password
          </p>
        </Link>
      </div>

      <div className="flex flex-col gap-6 items-start justify-center w-full h-fit">
        <Button
          className="border-none bg-primary-500 hover:bg-primary-500  shadow-none w-full h-fit py-4 rounded-[20px] "
          onClick={handleLogin}
        >
          <p className="text-[20px] font-bold text-light-900 h-[30px]">
            Sign in
          </p>
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
              Don't have an account?
            </p>
            <Link href="/signup">
              <p className="text-primary-500 paragraph-bold">Sign up</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
