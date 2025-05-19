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

  console.log("localStream in GroupConst", localStream);
  console.log("peer in GroupConst", peers);
  console.log("ongoingCall in GroupConst", ongoingGroupCall);

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (
        localStream &&
        localStream.active &&
        localStream.getTracks().length > 0
      ) {
        console.log("✅ Returning existing active local stream");
        return localStream;
      }

      if (localStream) {
        console.log("⚠️ Existing stream is not usable, releasing tracks");
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const constraints: MediaStreamConstraints = {
          audio: true,
          video:
            videoDevices.length > 0
              ? {
                  width: { min: 640, ideal: 1280, max: 1920 },
                  height: { min: 360, ideal: 720, max: 1080 },
                  frameRate: { min: 15, ideal: 30, max: 60 },
                  facingMode: faceMode || "user"
                }
              : false
        };

        console.log(
          "Requesting media with constraints:",
          JSON.stringify(constraints)
        );
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        console.log(
          `Stream obtained: active=${stream.active}, tracks=${
            stream.getTracks().length
          }`
        );
        stream.getTracks().forEach((track) => {
          console.log(
            `Local track: ${track.kind}:${track.id} (enabled: ${track.enabled})`
          );
          if (!track.enabled) track.enabled = true;
        });

        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);

        try {
          console.log("Attempting fallback to audio-only");
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
          });
          setLocalStream(audioStream);
          return audioStream;
        } catch (audioError) {
          console.error("Fallback to audio-only also failed:", audioError);
          setLocalStream(null);
          return null;
        }
      }
    },
    [localStream]
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
    (
      stream: MediaStream,
      initiator: boolean,
      partnerUser: SocketUser,
      updatedOngoing: OngoingGroupCall
    ) => {
      if (!stream?.active || stream.getTracks().length === 0) {
        console.warn("⚠️ Stream không hợp lệ hoặc đã bị hủy.");
        return;
      }

      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302"
          ]
        },
        {
          urls: "turn:turn.anyfirewall.com:443?transport=tcp",
          username: "webrtc",
          credential: "webrtc"
        }
      ];

      const peer = new Peer({
        initiator,
        trickle: true,
        config: { iceServers },
        offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true }
      });

      stream.getTracks().forEach((track) => {
        if (track.readyState === "live" && track.enabled) {
          console.log(`🎯 Adding live track: ${track.kind}`);
          (peer as any)._pc.addTrack(track, stream);
        } else {
          console.warn(
            `⚠️ Skipped track ${track.kind} - readyState: ${track.readyState}, enabled: ${track.enabled}`
          );
        }
      });

      const remoteStream = new MediaStream();
      peer.on("track", (track, stream) => {
        if (!remoteStream.getTracks().some((t) => t.id === track.id)) {
          remoteStream.addTrack(track);
        }

        console.log(
          `🎥 Track received: ${track.kind} from ${partnerUser.userId}`
        );

        if (remoteStream.getVideoTracks().length > 0) {
          setPeers(
            (prev) =>
              prev?.map((p) =>
                p.participantUser.userId === partnerUser.userId
                  ? { ...p, stream: remoteStream }
                  : p
              ) ?? []
          );
        }
      });

      peer.on("signal", (signal) => {
        socket?.emit("groupWebrtcSignal", {
          sdp: signal,
          fromUserId: currentSocketUser?.userId,
          toUserId: partnerUser.userId,
          ongoingGroupCall: updatedOngoing
        });
      });

      peer.on("error", console.error);
      peer.on("close", () => {
        console.log(`🔴 Peer closes connection with ${partnerUser.userId}`);
      });

      return peer;
    },
    [socket, currentSocketUser, setPeers]
  );

  const handleGroupCall = useCallback(
    async (membersOnline: SocketUser[], groupInfo: SocketGroup) => {
      setIsCallEnded(false);
      const stream = await getMediaStream();
      if (!stream) return;

      const participantsGroup: ParticipantsGroup = {
        groupDetails: groupInfo,
        currentJoiners: [currentSocketUser!],
        callees: membersOnline,
        caller: currentSocketUser!
      };

      const updatedOngoing = { participantsGroup, isRinging: false };
      setOngoingGroupCall(updatedOngoing);

      const newPeers = membersOnline
        .filter((u) => u.userId !== currentSocketUser?.userId)
        .map((member) => {
          const peer = createPeer(stream, true, member, updatedOngoing);
          return (
            peer && {
              peerConnection: peer,
              participantUser: member,
              stream: undefined
            }
          );
        })
        .filter(Boolean) as PeerDataGroup[];

      setPeers(newPeers);
      socket?.emit("groupCall", participantsGroup);
    },
    [createPeer, getMediaStream, socket, currentSocketUser]
  );

  const completeGroupPeerConnection = useCallback(
    async (data: {
      sdp: SignalData;
      fromUserId: string;
      ongoingGroupCall: OngoingGroupCall;
    }) => {
      if (!peers || peers.length === 0) {
        console.warn("⚠️ No peers are created.");
        return;
      }
      const newJoiners = data.ongoingGroupCall.participantsGroup.currentJoiners;
      const newCallees = data.ongoingGroupCall.participantsGroup.callees;

      const myJoiners =
        ongoingGroupCall?.participantsGroup.currentJoiners || [];
      const myCallees = ongoingGroupCall?.participantsGroup.callees || [];

      const mergedJoiners = Array.from(
        new Map(
          [...myJoiners, ...newJoiners].map((u) => [u.userId, u])
        ).values()
      );
      const mergedCallees = Array.from(
        new Map(
          [...myCallees, ...newCallees].map((u) => [u.userId, u])
        ).values()
      );

      const updatedOngoing: OngoingGroupCall = {
        ...ongoingGroupCall,
        participantsGroup: {
          ...data.ongoingGroupCall.participantsGroup,
          callees: mergedCallees,
          currentJoiners: mergedJoiners
        },
        isRinging: false
      };
      setOngoingGroupCall(updatedOngoing);

      const existingPeer = peers.find(
        (p) => p.participantUser.userId === data.fromUserId
      );

      if (existingPeer && existingPeer.peerConnection) {
        try {
          existingPeer.peerConnection.signal(data.sdp);
          console.log(`✅ Sent signal SDP to user ${data.fromUserId}`);
        } catch (error) {
          console.error("❌ Error sending signal SDP to user:", error);
        }
      }
    },
    [peers]
  );

  const handleJoinGroupCall = useCallback(
    async (ongoingGroupCall: OngoingGroupCall) => {
      setIsCallEnded(false);
      const stream = await getMediaStream();
      if (!stream) return;
      setLocalStream(stream);

      const updatedJoiners = [
        ...ongoingGroupCall.participantsGroup.currentJoiners,
        currentSocketUser!
      ];

      const updatedOngoing: OngoingGroupCall = {
        ...ongoingGroupCall,
        isRinging: false,
        participantsGroup: {
          ...ongoingGroupCall.participantsGroup,
          currentJoiners: updatedJoiners
        }
      };

      setOngoingGroupCall(updatedOngoing);

      const allPeers = [
        ongoingGroupCall.participantsGroup.caller,
        ...ongoingGroupCall.participantsGroup.callees
      ].filter((u) => u.userId !== currentSocketUser?.userId);

      const newPeers = allPeers
        .map((participant) => {
          const peer = createPeer(stream, true, participant, updatedOngoing);
          return (
            peer && {
              peerConnection: peer,
              participantUser: participant,
              stream: undefined
            }
          );
        })
        .filter(Boolean) as PeerDataGroup[];

      setPeers(newPeers);
    },
    [socket, currentSocketUser, createPeer, getMediaStream]
  );

  const handleRequestOngoingGroupCall = useCallback(
    async (groupInfo: SocketGroup) => {
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
    async (data: { groupId: string; fromUser: SocketUser }) => {
      if (!ongoingGroupCall) return;
      if (!socket || !adminInfo || !currentSocketUser) return;
      if (adminInfo._id !== ongoingGroupCall.participantsGroup.caller.userId)
        return;
      if (
        ongoingGroupCall.participantsGroup.groupDetails._id === data.groupId
      ) {
        const userId = data.fromUser.userId;
        console.log("📢 New participant joined:", userId);
        socket.emit("provideOngoingGroupCall", {
          ongoingGroupCall: ongoingGroupCall,
          calleeRequest: data.fromUser
        });
      }
    },
    [socket, adminInfo, ongoingGroupCall, createPeer, getMediaStream]
  );

  const handleReceiveOngoingGroupCall = useCallback(
    async (ongoingGroupCall: OngoingGroupCall) => {
      if (!socket || !adminInfo || !currentSocketUser) return;
      console.log("Check requesting ongoingGroupCall: ", ongoingGroupCall);
      const stream = await getMediaStream();
      if (!stream) return;

      const participantsGroup: ParticipantsGroup = {
        groupDetails: ongoingGroupCall.participantsGroup.groupDetails,
        currentJoiners: [
          currentSocketUser!,
          ...ongoingGroupCall.participantsGroup.currentJoiners
        ],
        callees: [
          currentSocketUser!,
          ...ongoingGroupCall.participantsGroup.callees
        ],
        caller: ongoingGroupCall.participantsGroup.caller
      };

      const updatedOngoing = { participantsGroup, isRinging: false };
      setOngoingGroupCall(updatedOngoing);

      const newPeers = [
        ongoingGroupCall.participantsGroup.caller,
        ...ongoingGroupCall.participantsGroup.callees
      ]
        .filter((u) => u.userId !== currentSocketUser?.userId)
        .map((member) => {
          const peer = createPeer(stream, true, member, updatedOngoing);
          return (
            peer && {
              peerConnection: peer,
              participantUser: member,
              stream: undefined
            }
          );
        })
        .filter(Boolean) as PeerDataGroup[];

      setPeers(newPeers);

      if (currentSocketUser) {
        socket?.emit("newGroupParticipant", {
          newCallee: currentSocketUser,
          updatedOngoing
        });
      }
    },
    [socket, adminInfo, currentSocketUser, createPeer, getMediaStream]
  );

  const handleNewPeerForYou = useCallback(
    async ({
      newCallee,
      updatedOngoing
    }: {
      newCallee: SocketUser;
      updatedOngoing: OngoingGroupCall;
    }) => {
      if (!socket || !adminInfo || !currentSocketUser || !localStream) return;

      const userId = newCallee.userId;
      console.log("📢 New participant peer:", userId);
      setOngoingGroupCall(updatedOngoing);

      const exists = peers?.some((p) => p.participantUser.userId === userId);
      if (exists) {
        console.log("⚠️ Peer with new participant already exists");
        return;
      }

      // ✅ Tạo peer mới với initiator: true
      const newPeer = createPeer(localStream, false, newCallee, updatedOngoing);
      if (!newPeer) return;

      setPeers((prev) => [
        ...(prev || []),
        {
          peerConnection: newPeer,
          participantUser: newCallee,
          stream: undefined
        }
      ]);

      // ✅ Lắng nghe track từ người mới
      const remoteStream = new MediaStream();
      newPeer.on("track", (track) => {
        remoteStream.addTrack(track);
        console.log(`🎉 Nhận track từ người mới ${userId}: ${track.kind}`);
        setPeers(
          (prev) =>
            prev?.map((p) =>
              p.participantUser.userId === userId
                ? { ...p, stream: remoteStream }
                : p
            ) ?? []
        );
      });

      newPeer.on("error", console.error);
      newPeer.on("close", () => {
        console.log(`🔴 Peer với ${userId} đã đóng`);
      });
    },
    [socket, peers, currentSocketUser, localStream, createPeer]
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

  // useEffect(() => {
  //   if (localStream) {
  //     attachTracksToPeers(localStream);
  //   }
  // }, [localStream, attachTracksToPeers]);

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
