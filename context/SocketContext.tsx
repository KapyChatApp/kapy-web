"use client";
import { Socket, io } from "socket.io-client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { useUserContext } from "./UserContext";
import { OngoingCall, Participants, SocketUser } from "@/types";

interface iSocketContext {
  socket: Socket | null;
  isSocketConnected: boolean;
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  handleCall: (user: SocketUser) => void;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { adminInfo } = useUserContext();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
  const [ongoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
  const currentSocketUser = onlineUsers?.find(
    (onlineUsers) => onlineUsers.userId === adminInfo?._id
  );

  const handleCall = useCallback(
    (user: SocketUser) => {
      if (!currentSocketUser) return;
      const participants = { caller: currentSocketUser, receiver: user };
      setOngoingCall({ participants, isRinging: false });
      socket?.emit("call", participants);
    },

    [socket, currentSocketUser, ongoingCall]
  );

  const onIncomingCall = useCallback(
    (participants: Participants) => {
      setOngoingCall({ participants, isRinging: true });
    },
    [socket, adminInfo, ongoingCall]
  );
  //initialize a socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
      withCredentials: true // Đảm bảo gửi cookie và session (nếu có)
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [adminInfo]);

  useEffect(() => {
    if (socket === null) return;

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsSocketConnected(true);
    }
    function onDisconnect() {
      setIsSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  //set online users
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.emit("addNewUsers", adminInfo);
    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getUsers", (res) => {
        setOnlineUsers(res);
      });
    };
  }, [socket, isSocketConnected, adminInfo]);

  // calls
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.on("incomingCall", onIncomingCall);

    return () => {
      socket.off("incomingCall", onIncomingCall);
    };
  }, [socket, isSocketConnected, adminInfo, onIncomingCall]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
        onlineUsers,
        ongoingCall,
        handleCall
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
