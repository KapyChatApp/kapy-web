import { SocketContextProvider } from "@/context/SocketContext";
import React from "react";

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <SocketContextProvider>{children}</SocketContextProvider>;
};

export default SocketProvider;
