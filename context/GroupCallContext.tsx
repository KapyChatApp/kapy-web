"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef
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
  setOngoingGroupCall: React.Dispatch<
    React.SetStateAction<OngoingGroupCall | null>
  >;
  handleGroupCall: (
    membersOnline: SocketUser[],
    groupInfo: SocketGroup
  ) => void;
  handleJoinGroupCall: (ongoingGroupCall: OngoingGroupCall) => void;
  handleGroupHangup: (data: {
    ongoingGroupCall?: OngoingGroupCall | null;
    isEmitHangup?: boolean;
  }) => void;
  handleRequestOngoingGroupCall: (groupInfo: SocketGroup) => void;
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
  const signalProcessingMap = useRef<Map<string, boolean>>(new Map());
  const earlySignalQueue = useRef<Map<string, SignalData[]>>(new Map());

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
    (group: ParticipantsGroup, ongoing?: OngoingGroupCall) => {
      console.log("Meeting comes from:", group.groupDetails.name);
      if (ongoing) {
        //setOngoingGroupCall(ongoing);
        console.log("Check ongoing call successfully: ", ongoing);
      } else {
        setOngoingGroupCall({
          participantsGroup: group,
          isRinging: true
        });
      }
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
      setOngoingGroupCall(null);

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
        setPeers(
          (prev) =>
            prev?.filter(
              (peer) => peer.participantUser.userId !== data.leaverUserId
            ) ?? []
        );

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
    [peers, localStream]
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
        console.log("🎉 Received remote stream!", remoteStream.id);
        console.log(
          "Remote stream tracks:",
          remoteStream.getTracks().map((t) => `${t.kind}:${t.id}`)
        );

        setPeers((prev) => {
          if (!prev) return prev;

          const updated = prev.map((p) => {
            if (p.peerConnection === peer) {
              console.log(
                `✅ Matched stream to peer: ${JSON.stringify(
                  p.participantUser
                )}`
              );
              return {
                ...p,
                stream: remoteStream
              };
            }
            return p;
          });

          console.log("Updated peers with stream:", updated.length);
          return updated;
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
      fromUser: SocketUser;
    }) => {
      const fromUserId = connectionData.fromUser.userId;

      if (!localStream) {
        console.warn("❌ Missing localStream in completeGroupPeerConnection");
        return;
      }

      // Ngăn việc xử lý signal đồng thời cho cùng một user
      if (signalProcessingMap.current.get(fromUserId)) {
        console.log("🔁 Skipping duplicate signal from:", fromUserId);
        return;
      }
      signalProcessingMap.current.set(fromUserId, true);

      // Cập nhật state ongoingGroupCall
      setOngoingGroupCall({
        ...connectionData.ongoingGroupCall,
        isRinging: false
      });

      // Kiểm tra đã có peer với người gửi signal chưa
      const existingPeer = peers?.find(
        (p) => p.participantUser.userId === fromUserId
      )?.peerConnection;

      if (existingPeer) {
        if (existingPeer.destroyed) {
          console.warn(`⚠️ Existing peer for ${fromUserId} is destroyed.`);
        } else {
          console.log(`✅ Signaling to existing peer: ${fromUserId}`);
          try {
            existingPeer.signal(connectionData.sdp);
          } catch (err) {
            console.error("❌ Error during signal to existing peer:", err);
          }
          signalProcessingMap.current.delete(fromUserId);
          return;
        }
      }

      // ❗ Nếu peer chưa tồn tại, tạo peer mới (GIỮ Y NGUYÊN logic của bạn)
      console.log(`🔄 Creating new peer for ${fromUserId}`);
      const newPeer = createPeer(localStream, false); // Callee là receiver

      setPeers((prev) => {
        const exists = prev?.some(
          (p) => p.participantUser.userId === fromUserId
        );
        if (exists) return prev;

        return [
          ...(prev || []),
          {
            peerConnection: newPeer,
            stream: undefined,
            participantUser: connectionData.fromUser
          }
        ];
      });

      // Gọi signal với dữ liệu vừa nhận
      try {
        newPeer.signal(connectionData.sdp);
      } catch (err) {
        console.warn("⚠️ Peer chưa sẵn sàng để signal, lưu vào queue");
        const existingQueue = earlySignalQueue.current.get(fromUserId) || [];
        earlySignalQueue.current.set(fromUserId, [
          ...existingQueue,
          connectionData.sdp
        ]);
      }

      // Lắng nghe phản hồi từ peer
      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          console.log(`📤 Responding signal to ${fromUserId}`);
          socket.emit("groupWebrtcSignal", {
            sdp: data,
            ongoingGroupCall: connectionData.ongoingGroupCall,
            isCaller:
              currentSocketUser?.userId ===
              connectionData.ongoingGroupCall.participantsGroup.caller.userId,
            fromUser: currentSocketUser
          });
        }
      });

      // Cleanup signal lock
      setTimeout(() => {
        signalProcessingMap.current.delete(fromUserId);
      }, 300);
    },
    [localStream, peers, createPeer, socket, currentSocketUser]
  );

  const handleJoinGroupCall = useCallback(
    async (ongoingGroupCall: OngoingGroupCall, isNewCallee?: boolean) => {
      setIsCallEnded(false);

      // Update the ongoingGroupCall state
      setOngoingGroupCall({
        ...ongoingGroupCall,
        isRinging: false
      });

      // Get local media stream
      const stream = await getMediaStream();
      if (!stream) {
        console.log("❌ Cannot get local stream");
        return;
      }
      setLocalStream(stream);

      // First, clear any existing peers to avoid duplicates
      if (isNewCallee) {
        setPeers([]);
      }

      // Get participants from the ongoing call
      const { caller, receivers } = ongoingGroupCall.participantsGroup;

      // Create a list of all participants except current user
      const allParticipants = [caller, ...receivers].filter(
        (user) => user.userId !== currentSocketUser?.userId
      );

      console.log(`🔄 Creating ${allParticipants.length} peer connections`);

      // Create a peer connection for each participant
      allParticipants.forEach((participant) => {
        const newPeer = createPeer(stream, true);

        setPeers((prev) => [
          ...(prev || []),
          {
            peerConnection: newPeer,
            stream: undefined,
            participantUser: participant
          }
        ]);

        // Set up signal handler
        newPeer.on("signal", async (sdp: SignalData) => {
          console.log(`📤 Sending initial signal to ${participant.userId}`);
          socket?.emit("groupWebrtcSignal", {
            sdp,
            ongoingGroupCall,
            isCaller: false,
            fromUser: currentSocketUser
          });
        });
      });

      // Notify others that we joined if we're a new participant
      if (isNewCallee) {
        console.log("🔔 Announcing arrival as new participant");
        socket?.emit("newGroupParticipant", {
          newCallee: currentSocketUser,
          updatedOngoing: ongoingGroupCall
        });
      }
    },
    [socket, currentSocketUser, createPeer, getMediaStream]
  );

  const handleRequestOngoingGroupCall = useCallback(
    (groupInfo: SocketGroup) => {
      console.log("Request is clicked.");
      if (socket && isSocketConnected) {
        console.log("Emit request ongoingGroupCall: ", {
          groupInfo,
          fromUser: currentSocketUser
        });
        socket.emit("requestOngoingCall", {
          groupInfo,
          fromUser: currentSocketUser
        });
      }
    },
    [socket, isSocketConnected, currentSocketUser]
  );

  const handleNeedOngoingGroupCall = useCallback(
    (data: { groupId: string; fromUser: SocketUser }) => {
      if (!ongoingGroupCall) return;
      if (!socket || !adminInfo) return;
      console.log("🧩 Need group call data");
      if (
        ongoingGroupCall.participantsGroup.groupDetails._id === data.groupId
      ) {
        socket.emit("provideOngoingGroupCall", {
          ongoingGroupCall: ongoingGroupCall,
          calleeRequest: data.fromUser
        });
      }
    },
    [socket, adminInfo, ongoingGroupCall]
  );

  const handleReceiveOngoingGroupCall = useCallback(
    async (ongoingGroupCall: OngoingGroupCall) => {
      if (!socket || !adminInfo || !currentSocketUser) return;
      console.log("Check requesting ongoingGroupCall: ", ongoingGroupCall);
      const alreadyJoined = ongoingGroupCall.participantsGroup.receivers.some(
        (r) => r.userId === adminInfo._id
      );
      const updatedReceivers = alreadyJoined
        ? ongoingGroupCall.participantsGroup.receivers
        : [...ongoingGroupCall.participantsGroup.receivers, currentSocketUser];

      const updatedOngoing: OngoingGroupCall = {
        ...ongoingGroupCall,
        participantsGroup: {
          ...ongoingGroupCall.participantsGroup,
          receivers: updatedReceivers
        },
        isRinging: false
      };

      setOngoingGroupCall(updatedOngoing);

      handleJoinGroupCall(updatedOngoing, true);
    },
    [socket, adminInfo, currentSocketUser, handleJoinGroupCall]
  );

  const handleNewPeerForYou = useCallback(
    async ({
      newCallee,
      updatedOngoing
    }: {
      newCallee: SocketUser;
      updatedOngoing: OngoingGroupCall;
    }) => {
      if (!socket || !adminInfo || !currentSocketUser) return;

      const userId = newCallee.userId;
      console.log("📢 New participant joined:", userId);

      setOngoingGroupCall(updatedOngoing);

      // Đảm bảo có localStream
      let stream = localStream;
      if (!stream || stream.getTracks().length === 0) {
        console.warn("⚠️ Missing localStream. Getting stream...");
        stream = await getMediaStream();
        if (!stream) {
          console.error("❌ Cannot get stream for new peer");
          return;
        }
        setLocalStream(stream);
      }

      // Nếu đã có peer thì bỏ qua
      const exists = peers?.some((p) => p.participantUser.userId === userId);
      if (exists) {
        console.warn("⚠️ Peer already exists with", userId);
        return;
      }

      const newPeer = createPeer(stream, true);

      setPeers((prev) => [
        ...(prev || []),
        {
          peerConnection: newPeer,
          stream: undefined,
          participantUser: newCallee
        }
      ]);

      newPeer.on("signal", async (sdp: SignalData) => {
        console.log(`📤 Sending signal to ${userId}`);
        socket.emit("groupWebrtcSignal", {
          sdp,
          ongoingGroupCall: updatedOngoing,
          isCaller: false,
          fromUser: currentSocketUser
        });
      });

      newPeer.on("error", (err) => {
        console.error("❌ Peer error:", err);
      });

      newPeer.on("close", () => {
        console.log("⚠️ Peer closed (don't hangup the whole call)");
      });

      // ✅ Check and apply queued signals (if any)
      const queuedSignals = earlySignalQueue.current.get(userId);
      if (queuedSignals && queuedSignals.length > 0) {
        console.log(
          `📤 Applying ${queuedSignals.length} queued signals for ${userId}`
        );
        queuedSignals.forEach((sdp) => {
          try {
            newPeer.signal(sdp);
          } catch (err) {
            console.error("❌ Error applying queued signal:", err);
          }
        });
        earlySignalQueue.current.delete(userId);
      }
    },
    [
      socket,
      adminInfo,
      currentSocketUser,
      localStream,
      peers,
      createPeer,
      getMediaStream
    ]
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

    socket.on("needOngoingGroupCall", handleNeedOngoingGroupCall);
    console.log("🔔 Event needing ongoingGroupCall is listening...");

    socket.on("receiveOngoingGroupCall", handleReceiveOngoingGroupCall);
    console.log("🔔 Event receiving ongoingGroupCall is listening...");

    socket.on("newPeerForYou", handleNewPeerForYou);
    console.log("🔔 Event new callee notification is listening...");

    return () => {
      socket.off("incomingGroupCall", onIncomingGroupCall);
      socket.off("groupWebrtcSignal", completeGroupPeerConnection);
      socket.off("groupHangup", handleGroupHangup);
      socket.off("leavingRoom", handleLeaveGroup);
      socket.off("needOngoingGroupCall", handleNeedOngoingGroupCall);
      socket.off("receiveOngoingGroupCall", handleReceiveOngoingGroupCall);
      socket.off("newPeerForYou", handleNewPeerForYou);
    };
  }, [
    socket,
    isSocketConnected,
    onIncomingGroupCall,
    adminInfo,
    completeGroupPeerConnection,
    handleGroupHangup,
    handleLeaveGroup,
    handleNeedOngoingGroupCall,
    handleReceiveOngoingGroupCall,
    handleNewPeerForYou
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
        setOngoingGroupCall,
        handleGroupCall,
        handleJoinGroupCall,
        handleGroupHangup,
        handleRequestOngoingGroupCall
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
