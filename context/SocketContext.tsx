"use client";
import { io, Socket } from "socket.io-client";
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
  localStream: MediaStream | null;
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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) return localStream;

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 15, ideal: 30, max: 60 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined
          }
        });

        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setLocalStream(null);
        return null;
      }
    },
    [localStream]
  );

  const handleCall = useCallback(
    async (user: SocketUser) => {
      if (!currentSocketUser) return;

      const stream = await getMediaStream();

      if (!stream) {
        console.log("Error: No stream available.");
        return;
      }

      const participants = { caller: currentSocketUser, receiver: user };
      setOngoingCall({ participants, isRinging: false });
      socket?.emit("call", participants);
    },

    [socket, currentSocketUser, ongoingCall]
  );

  const onIncomingCall = useCallback(
    (participants: Participants) => {
      console.log("Cuộc gọi đến từ:", participants.caller);
      setOngoingCall({ participants, isRinging: true });
      console.log("Cuộc gọi đến từ:", participants.caller);
    },
    [socket, adminInfo, ongoingCall]
  );

  //initialize a socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
      withCredentials: true
    });

    newSocket.on("connect", () => {
      console.log("Socket connected with ID:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
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
      console.log("Socket ID after connection:", socket?.id);
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
    if (!socket || !isSocketConnected || !adminInfo) {
      console.warn("Socket or adminInfo is not ready.");
      return;
    }

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
    console.log("🔔 Event incomingCall is listening...");

    return () => {
      socket.off("incomingCall", onIncomingCall);
    };
  }, [socket, isSocketConnected, onIncomingCall]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
        onlineUsers,
        ongoingCall,
        localStream,
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
