"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { SocketUser } from "@/types/socket";
import Peer, { SignalData } from "simple-peer";
import { useUserContext } from "./UserContext";
import {
  OngoingGroupCall,
  ParticipantsGroup,
  PeerDataGroup,
  SocketGroup
} from "@/types/group-call";
import { useSocketContext } from "./SocketContext";

interface iGroupCallContext {
  isSocketConnected: boolean;
  onlineGroupUsers: SocketUser[] | null;
  ongoingGroupCall: OngoingGroupCall | null;
  localStream: MediaStream | null;
  peers: PeerDataGroup[] | null;
  isCallEnded: boolean;
  handleGroupCall: (
    membersOnline: SocketUser[],
    groupInfo: SocketGroup
  ) => void;
  handleJoinGroupCall: (ongoingGroupCall: OngoingGroupCall) => void;
  handleGroupHangup: (data: {
    ongoingGroupCall?: OngoingGroupCall | null;
    isEmitHangup?: boolean;
  }) => void;
}

export const GroupCallContext = createContext<iGroupCallContext | null>(null);

export const GroupCallContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { adminInfo } = useUserContext();
  const { socket } = useSocketContext();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineGroupUsers, setOnlineGroupUsers] = useState<SocketUser[] | null>(
    null
  );
  const [ongoingGroupCall, setOngoingGroupCall] =
    useState<OngoingGroupCall | null>(null);
  const currentSocketUser = onlineGroupUsers?.find(
    (onlineUsers) => onlineUsers.userId === adminInfo?._id
  );
  const [peers, setPeers] = useState<PeerDataGroup[] | null>(null);
  const [isCallEnded, setIsCallEnded] = useState(false);

  console.log("localStream in GroupConst", localStream);
  console.log("peer in GroupConst", peers);
  console.log("ongoingCall in GroupConst", ongoingGroupCall);

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

  const handleGroupCall = useCallback(
    async (membersOnline: SocketUser[], groupInfo: SocketGroup) => {
      setIsCallEnded(false);

      const stream = await getMediaStream();
      if (!stream) {
        console.log("Error: No stream available.");
        return;
      }

      const participantsGroup: ParticipantsGroup = {
        groupDetails: groupInfo,
        receivers: membersOnline,
        caller: currentSocketUser as SocketUser
      };

      setOngoingGroupCall({
        participantsGroup,
        isRinging: false
      });

      socket?.emit("groupCall", participantsGroup);
    },
    [socket, getMediaStream, currentSocketUser]
  );

  const onIncomingGroupCall = useCallback(
    (group: ParticipantsGroup) => {
      console.log("Meeting comes from:", group.groupDetails.name);
      setOngoingGroupCall({
        participantsGroup: group,
        isRinging: true
      });
    },
    [socket, adminInfo, ongoingGroupCall]
  );

  const handleGroupHangup = useCallback(
    (data: {
      ongoingGroupCall?: OngoingGroupCall | null;
      isEmitHangup?: boolean;
    }) => {
      if (socket && adminInfo && data?.ongoingGroupCall) {
        socket.emit("groupHangup", {
          ongoingGroupCall: data.ongoingGroupCall,
          userHangingupId: adminInfo._id,
          isEmitHangup: data.isEmitHangup
        });
      }
      // Ngắt kết nối local
      setPeers(null);
      if (data?.ongoingGroupCall) {
        setOngoingGroupCall(data.ongoingGroupCall); // cập nhật cái mới
      } else {
        setOngoingGroupCall(null); // kết thúc hẳn
      }

      setIsCallEnded(true);

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      setIsCallEnded(true);
    },
    [socket, adminInfo, localStream]
  );

  const handleLeaveGroup = useCallback(
    (data: {
      leaverUserId?: string | null;
      participantsGroup?: ParticipantsGroup | null;
    }) => {
      console.log("📤 User leaving:", data.leaverUserId);

      if (peers && peers.length > 0 && data.participantsGroup) {
        setPeers((prev) => {
          if (!prev) return [];

          return prev
            .filter((peer) =>
              peer.participantUser.some(
                (user) => user.userId === data.leaverUserId
              )
            ) // giữ lại peer nào có chứa leaverUserId
            .map((peer) => ({
              ...peer,
              participantUser: peer.participantUser.filter(
                (user) => user.userId !== data.leaverUserId
              )
            }));
        });
      }

      setOngoingGroupCall((prev) => {
        if (!prev) return null;

        if (data.participantsGroup) {
          const updated: OngoingGroupCall = {
            participantsGroup: data.participantsGroup,
            isRinging: false
          };
          console.log("✅ Updating ongoingGroupCall to:", updated);
          return updated;
        }
        return prev;
      });
    },
    [peers]
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
      peer.on("stream", (remoteStream) => {
        setPeers((prevPeers) => {
          if (!prevPeers) return prevPeers;

          return prevPeers.map((peerObj) => {
            if ((peerObj.peerConnection as any)._id === (peer as any)._id) {
              return {
                ...peerObj,
                stream: remoteStream
              };
            }
            return peerObj;
          });
        });
      });

      peer.on("error", console.error);
      peer.on("close", () => {
        handleGroupHangup({});
      });

      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
      rtcPeerConnection.oniceconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "disconnected" ||
          rtcPeerConnection.iceConnectionState === "failed"
        ) {
          handleGroupHangup({});
        }
      };
      return peer;
    },
    [ongoingGroupCall, setPeers]
  );

  const completeGroupPeerConnection = useCallback(
    async (connectionData: {
      sdp: SignalData;
      ongoingGroupCall: OngoingGroupCall;
      isCaller: boolean;
    }) => {
      if (!localStream) {
        console.log("Missing the localStream");
        return;
      }

      if (peers && peers.length > 0) {
        peers.forEach((p) => {
          connectionData.sdp && p.peerConnection.signal(connectionData.sdp);
        });
        return;
      }

      const newPeer = createPeer(localStream, true);

      setPeers((prev) => [
        ...(prev || []),
        {
          peerConnection: newPeer,
          stream: undefined,
          participantUser:
            connectionData.ongoingGroupCall.participantsGroup.receivers
        }
      ]);

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          socket.emit("groupWebrtcSignal", {
            sdp: data,
            ongoingGroupCall,
            isCaller: true
          });
        }
      });
    },
    [localStream, createPeer, peers, ongoingGroupCall]
  );

  const handleJoinGroupCall = useCallback(
    async (ongoingGroupCall: OngoingGroupCall) => {
      setIsCallEnded(false);
      setOngoingGroupCall((prev) => {
        if (!prev) {
          return null;
        }
        return {
          ...prev,
          isRinging: false
        };
      });

      const stream = await getMediaStream();
      if (!stream) {
        console.log("Could not get a stream in handleJoinCall");
        return;
      }

      const newPeer = createPeer(stream, true);
      const receiverAccept =
        ongoingGroupCall.participantsGroup.receivers.filter(
          (user) => user.userId !== adminInfo._id
        );
      setPeers((prev) => [
        ...(prev || []),
        {
          peerConnection: newPeer,
          stream: undefined,
          participantUser: [
            ongoingGroupCall.participantsGroup.caller,
            ...receiverAccept
          ]
        }
      ]);

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          socket.emit("groupWebrtcSignal", {
            sdp: data,
            ongoingGroupCall,
            isCaller: false
          });
        }
      });
    },
    [socket, currentSocketUser, adminInfo]
  );

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
      setOnlineGroupUsers(res);
    });

    return () => {
      socket.off("getUsers", (res) => {
        setOnlineGroupUsers(res);
      });
    };
  }, [socket, isSocketConnected, adminInfo]);

  // calls
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.on("incomingGroupCall", onIncomingGroupCall);
    console.log("🔔 Event group incomingCall is listening...");

    socket.on("groupWebrtcSignal", completeGroupPeerConnection);
    console.log("🔔 Event group webrtcSignal is listening...");

    socket.on("groupHangup", handleGroupHangup);
    console.log("🔔 Event group hangup is listening...");

    socket.on("leavingRoom", handleLeaveGroup);
    console.log("🔔 Event leaving group is listening...");

    return () => {
      socket.off("incomingGroupCall", onIncomingGroupCall);
      socket.off("groupWebrtcSignal", completeGroupPeerConnection);
      socket.off("groupHangup", handleGroupHangup);
      socket.off("leavingRoom", handleLeaveGroup);
    };
  }, [
    socket,
    isSocketConnected,
    onIncomingGroupCall,
    adminInfo,
    completeGroupPeerConnection,
    handleGroupHangup
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
    <GroupCallContext.Provider
      value={{
        isSocketConnected,
        onlineGroupUsers,
        ongoingGroupCall,
        localStream,
        peers,
        isCallEnded,
        handleGroupCall,
        handleJoinGroupCall,
        handleGroupHangup
      }}
    >
      {children}
    </GroupCallContext.Provider>
  );
};

export const useGroupSocketContext = () => {
  const context = useContext(GroupCallContext);
  if (context === null) {
    throw new Error(
      "useGroupCallContext must be used within a GroupCallProvider"
    );
  }
  return context;
};
