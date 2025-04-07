"use client";
import { io, Socket } from "socket.io-client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  use
} from "react";
import { useUserContext } from "./UserContext";
import { OngoingCall, Participants, PeerData, SocketUser } from "@/types";
import Peer, { SignalData } from "simple-peer";

interface iSocketContext {
  socket: Socket | null;
  isSocketConnected: boolean;
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  peer: PeerData | null;
  isCallEnded: boolean;
  handleCall: (user: SocketUser, isVideoCall: boolean) => void;
  handleJoinCall: (ongoingCall: OngoingCall) => void;
  handleHangup: (data: {
    ongoingCall?: OngoingCall | null;
    isEmitHangup?: boolean;
  }) => void;
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
  const [peer, setPeer] = useState<PeerData | null>(null);
  const [isCallEnded, setIsCallEnded] = useState(false);

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) return localStream;

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const constraints: MediaStreamConstraints = {
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 15, ideal: 30, max: 60 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
    async (user: SocketUser, isVideoCall: boolean) => {
      setIsCallEnded(false);
      if (!currentSocketUser) return;

      const stream = await getMediaStream();

      if (!stream) {
        console.log("Error: No stream available.");
        return;
      }

      const participants = { caller: currentSocketUser, receiver: user };
      setOngoingCall({
        participants,
        isRinging: false,
        isVideoCall: isVideoCall
      });
      socket?.emit("call", participants, isVideoCall);
    },

    [socket, currentSocketUser, ongoingCall]
  );

  const onIncomingCall = useCallback(
    (participants: Participants, isVideoCall: boolean) => {
      console.log("Cuộc gọi đến từ:", participants.caller);
      setOngoingCall({
        participants,
        isRinging: true,
        isVideoCall: isVideoCall
      });
      console.log("Cuộc gọi đến từ:", participants.caller, isVideoCall);
    },
    [socket, adminInfo, ongoingCall]
  );

  const handleHangup = useCallback(
    (data: { ongoingCall?: OngoingCall | null; isEmitHangup?: boolean }) => {
      if (socket && adminInfo && data?.ongoingCall && data.isEmitHangup) {
        socket.emit("hangup", {
          ongoingCall: data.ongoingCall,
          userHangingupId: adminInfo._id
        });
      }
      setPeer(null);
      setOngoingCall(null);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      setIsCallEnded(true);
    },
    [socket, adminInfo, localStream]
  );

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302"
          ]
        }
      ];

      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: {
          iceServers
        }
      });

      peer.on("stream", (stream) => {
        setPeer((prev) => {
          if (!prev) return prev;
          return { ...prev, stream };
        });
      });
      peer.on("error", console.error);
      peer.on("close", () => {
        handleHangup({});
      });

      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
      rtcPeerConnection.oniceconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "disconnected" ||
          rtcPeerConnection.iceConnectionState === "failed"
        ) {
          handleHangup({});
        }
      };
      return peer;
    },
    [ongoingCall, setPeer]
  );

  const completePeerConnection = useCallback(
    async (connectionData: {
      sdp: SignalData;
      ongoingCall: OngoingCall;
      isCaller: boolean;
    }) => {
      if (!localStream) {
        console.log("Missing the localStream");
        return;
      }

      if (peer) {
        peer.peerConnection.signal(connectionData.sdp);
        return;
      }

      const newPeer = createPeer(localStream, true);
      setPeer({
        peerConnection: newPeer,
        stream: undefined,
        participantUser: connectionData.ongoingCall.participants.receiver
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          console.log("Emit offer");
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: true
          });
        }
      });
    },
    [localStream, createPeer, peer, ongoingCall]
  );

  const handleJoinCall = useCallback(
    async (ongoingCall: OngoingCall) => {
      setIsCallEnded(false);
      setOngoingCall((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isRinging: false,
          isVideoCall: ongoingCall.isVideoCall
        };
      });

      const stream = await getMediaStream();
      if (!stream) {
        console.log("Could not get a stream in handleJoinCall");
        return;
      }

      const newPeer = createPeer(stream, true);
      setPeer({
        peerConnection: newPeer,
        stream: undefined,
        participantUser: ongoingCall.participants.caller
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          console.log("Emit offer");
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: false
          });
        }
      });
    },
    [socket, currentSocketUser]
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

    socket.on("webrtcSignal", completePeerConnection);
    console.log("🔔 Event webrtcSignal is listening...");

    socket.on("hangup", handleHangup);
    console.log("🔔 Event hangup is listening...");

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", completePeerConnection);
      socket.off("hangup", handleHangup);
    };
  }, [
    socket,
    isSocketConnected,
    onIncomingCall,
    adminInfo,
    completePeerConnection,
    handleHangup
  ]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isCallEnded) {
      timeout = setTimeout(() => {
        setIsCallEnded(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [isCallEnded]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
        onlineUsers,
        ongoingCall,
        localStream,
        peer,
        isCallEnded,
        handleCall,
        handleJoinCall,
        handleHangup
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
