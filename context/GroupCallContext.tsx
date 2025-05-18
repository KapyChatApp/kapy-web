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
        (peer as any)._pc.addTrack(track, stream);
      });

      const remoteStream = new MediaStream();
      peer.on("track", (track) => {
        remoteStream.addTrack(track);
        setPeers(
          (prev) =>
            prev?.map((p) =>
              p.participantUser.userId === partnerUser.userId
                ? { ...p, stream: remoteStream }
                : p
            ) ?? []
        );
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
        receivers: membersOnline,
        callees: [],
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
    async ({
      sdp,
      fromUserId,
      ongoingGroupCall
    }: {
      sdp: SignalData;
      fromUserId: string;
      ongoingGroupCall: OngoingGroupCall;
    }) => {
      if (!peers || peers.length === 0) {
        console.warn("⚠️ No peers are created.");
        return;
      }
      const existingPeer = peers.find(
        (p) => p.participantUser.userId === fromUserId
      );

      if (existingPeer && existingPeer.peerConnection) {
        const newCallees = ongoingGroupCall.participantsGroup.callees;
        setOngoingGroupCall((prev) => {
          const myCallees = prev?.participantsGroup.callees || [];
          const mergedCallees = Array.from(
            new Map(
              [...myCallees, ...newCallees].map((callee) => [
                callee.userId,
                callee
              ])
            ).values()
          );
          return prev
            ? {
                ...prev,
                participantsGroup: {
                  ...prev.participantsGroup,
                  callees: mergedCallees
                }
              }
            : prev;
        });
        try {
          existingPeer.peerConnection.signal(sdp);
          console.log(`✅ Sent signal SDP to user ${fromUserId}`);
        } catch (error) {
          console.error("❌ Error sending signal SDP to user:", error);
        }
      } else {
        const stream = await getMediaStream();
        if (!stream) return;
        const peer = createPeer(
          stream,
          false,
          { userId: fromUserId } as SocketUser,
          ongoingGroupCall
        );
        if (!peer) return;
        setPeers((prev) => [
          ...(prev || []),
          {
            peerConnection: peer,
            participantUser: { userId: fromUserId } as SocketUser,
            stream: undefined
          }
        ]);
        peer.signal(sdp);
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

      const updatedCallees = [
        ...ongoingGroupCall.participantsGroup.callees,
        currentSocketUser!
      ];

      const updatedOngoing: OngoingGroupCall = {
        ...ongoingGroupCall,
        isRinging: false,
        participantsGroup: {
          ...ongoingGroupCall.participantsGroup,
          callees: updatedCallees
        }
      };

      setOngoingGroupCall(updatedOngoing);

      const allPeers = [
        ongoingGroupCall.participantsGroup.caller,
        ...ongoingGroupCall.participantsGroup.receivers
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
      handleJoinGroupCall(ongoingGroupCall);
    },
    [socket, adminInfo, currentSocketUser, handleJoinGroupCall]
  );

  // const handleNewPeerForYou = useCallback(
  //   async ({
  //     newCallee,
  //     updatedOngoing
  //   }: {
  //     newCallee: SocketUser;
  //     updatedOngoing: OngoingGroupCall;
  //   }) => {
  //     if (!socket || !adminInfo || !currentSocketUser) return;

  //     const userId = newCallee.userId;
  //     console.log("📢 New participant joined:", userId);

  //     setOngoingGroupCall(updatedOngoing);

  //     // Đảm bảo có localStream
  //     let stream = localStream;
  //     if (!stream || stream.getTracks().length === 0) {
  //       console.warn("⚠️ Missing localStream. Getting stream...");
  //       stream = await getMediaStream();
  //       if (!stream) {
  //         console.error("❌ Cannot get stream for new peer");
  //         return;
  //       }
  //       setLocalStream(stream);
  //     }

  //     // Nếu đã có peer thì bỏ qua
  //     const exists = peers?.some((p) => p.participantUser.userId === userId);
  //     if (exists) {
  //       console.warn("⚠️ Peer already exists with", userId);
  //       return;
  //     }

  //     const newPeer = createPeer(stream, true);

  //     setPeers((prev) => [
  //       ...(prev || []),
  //       {
  //         peerConnection: newPeer,
  //         stream: undefined,
  //         participantUser: newCallee
  //       }
  //     ]);

  //     newPeer.on("signal", async (sdp: SignalData) => {
  //       console.log(`📤 Sending signal to ${userId}`);
  //       socket.emit("groupWebrtcSignal", {
  //         sdp,
  //         ongoingGroupCall: updatedOngoing,
  //         isCaller: false,
  //         fromUser: currentSocketUser
  //       });
  //     });

  //     newPeer.on("error", (err) => {
  //       console.error("❌ Peer error:", err);
  //     });

  //     newPeer.on("close", () => {
  //       console.log("⚠️ Peer closed (don't hangup the whole call)");
  //     });

  //     // ✅ Check and apply queued signals (if any)
  //     const queuedSignals = earlySignalQueue.current.get(userId);
  //     if (queuedSignals && queuedSignals.length > 0) {
  //       console.log(
  //         `📤 Applying ${queuedSignals.length} queued signals for ${userId}`
  //       );
  //       queuedSignals.forEach((sdp) => {
  //         try {
  //           newPeer.signal(sdp);
  //         } catch (err) {
  //           console.error("❌ Error applying queued signal:", err);
  //         }
  //       });
  //       earlySignalQueue.current.delete(userId);
  //     }
  //   },
  //   [
  //     socket,
  //     adminInfo,
  //     currentSocketUser,
  //     localStream,
  //     peers,
  //     createPeer,
  //     getMediaStream
  //   ]
  // );

  const attachTracksToPeers = useCallback(
    (stream: MediaStream) => {
      if (!peers || peers.length === 0) return;

      peers.forEach(({ peerConnection }) => {
        const senderIds = (peerConnection as any)._pc
          .getSenders()
          ?.map((s: RTCRtpSender) => s.track?.id);

        stream.getTracks().forEach((track) => {
          const alreadyAdded = senderIds?.includes(track.id);
          if (!alreadyAdded) {
            try {
              console.log(`🎯 Adding track ${track.kind} to existing peer`);
              (peerConnection as any)._pc.addTrack(track, stream);
            } catch (err) {
              console.warn("⚠️ Failed to add track:", err);
            }
          }
        });
      });
    },
    [peers]
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

    console.log("🔔 Event new callee notification is listening...");

    return () => {
      socket.off("incomingGroupCall", onIncomingGroupCall);
      socket.off("groupWebrtcSignal", completeGroupPeerConnection);
      socket.off("groupHangup", handleGroupHangup);
      socket.off("leavingRoom", handleLeaveGroup);
      socket.off("needOngoingGroupCall", handleNeedOngoingGroupCall);
      socket.off("receiveOngoingGroupCall", handleReceiveOngoingGroupCall);
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
    handleReceiveOngoingGroupCall
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

  useEffect(() => {
    if (localStream) {
      attachTracksToPeers(localStream);
    }
  }, [localStream, attachTracksToPeers]);

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
