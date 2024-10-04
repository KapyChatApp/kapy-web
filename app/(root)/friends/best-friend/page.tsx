import LeftComponent from "@/components/friends/LeftComponent";
import RightComponent from "@/components/friends/RightComponent";
import { user } from "@/constants/object";
import React from "react";

const page = () => {
  const bestUser = user.filter((item) => item.status === "best");
  return <RightComponent friendList={bestUser} />;
};

export default page;
