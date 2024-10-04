import RightComponent from "@/components/friends/RightComponent";
import { strangeFriend } from "@/constants/friends";
import React from "react";

const page = () => {
  return <RightComponent friendList={strangeFriend} />;
};

export default page;
