import RightComponent from "@/components/friends/RightComponent";
import { user } from "@/constants/object";
import React from "react";

const page = () => {
  return <RightComponent friendList={user} />;
};

export default page;
