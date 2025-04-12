import { GroupCallContextProvider } from "@/context/GroupCallContext";
import React from "react";

const GroupCallProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <GroupCallContextProvider>{children}</GroupCallContextProvider>;
};

export default GroupCallProvider;
