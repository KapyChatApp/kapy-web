"use client";
import RightComponent from "@/components/friends/RightComponent";
import { useFriendContext } from "@/context/FriendContext";
import { getMyListBestFriend } from "@/lib/data/mine/dataBestFriend";
import React, { useEffect, useState } from "react";

const page = () => {
  return <RightComponent />;
};

export default page;
