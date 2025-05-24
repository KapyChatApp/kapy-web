"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import RightTop from "./RightTop";
import RightBottom from "./RightBottom";
import RightMiddle from "./RightMiddle";
import OpenMoreDisplay from "./OpenMoreDisplay";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import {
  MessageBoxInfo,
  ReadedStatusPusher,
  ResponseMessageDTO
} from "@/lib/DTO/message";
import { FriendRequestDTO } from "@/lib/DTO/friend";
import { unBlockFr } from "@/lib/services/friend/unblock";
import { useFriendContext } from "@/context/FriendContext";
import { checkRelation } from "@/lib/services/user/checkRelation";
import ReportCard from "@/components/shared/ReportCard";
import { getRealTimeOfUser } from "@/lib/services/user/getRealTime";
import { getPusherClient } from "@/lib/pusher";
import { useLayoutContext } from "@/context/LayoutContext";
import { getMyListFriend } from "@/lib/data/mine/dataAllFriends";
import { fetchMessages } from "@/lib/data/message/dataMessages";
import { useGroupSocketContext } from "@/context/GroupCallContext";

interface RightMessageProps {
  chatItem: MessageBoxInfo | undefined;
}

const RightMessage = ({ chatItem }: RightMessageProps) => {
  const pathname = usePathname();
  const [isReport, setReport] = useState(false);
  const [error, setError] = useState("");
  const isGroup = pathname.startsWith("/group-chat");

  //FetchMessage Backend
  const { id } = useParams();
  const [relation, setRelation] = useState("");
  const { adminInfo, isOnlineChat } = useUserContext();
  const { setListBlockedFriend, setListFriend } = useFriendContext();
  const { messagesByBox, setMemberList, setCreateBy, setMessagesByBox } =
    useChatContext();
  const { openMore, isParagraphVisible } = useLayoutContext();
  const { ongoingGroupCall } = useGroupSocketContext();
  const adminId = adminInfo._id;

  const onclose = () => {
    setReport(false);
  };

  //boxId
  const [boxId, setBoxId] = useState<string>("");
  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const id = parts.pop();

    if (id) {
      setBoxId(id);
    }
  }, [boxId]);

  //Right Top
  let top: any;
  if (id && chatItem) {
    const isOnlineGroup = chatItem.memberInfo.some(
      (member) => isOnlineChat[member._id]
    );
    const isOnline = isOnlineChat[chatItem.receiverInfo._id];
    const membersGroup = chatItem.memberInfo;
    top = isGroup
      ? {
          _id: chatItem.id,
          ava: chatItem.groupAva
            ? chatItem.groupAva
            : "/assets/images/icon.png",
          name: chatItem.groupName ? chatItem.groupName : "Group Chat",
          membersGroup,
          onlineGroup: chatItem.memberInfo.filter(
            (member) => isOnlineChat[member._id]
          ).length,
          isOnline: isOnlineGroup
        }
      : {
          _id: chatItem.receiverInfo._id,
          ava:
            chatItem.receiverInfo && chatItem.receiverInfo.avatar
              ? chatItem.receiverInfo.avatar
              : "/assets/ava/default.png",

          name:
            chatItem.receiverInfo &&
            chatItem.receiverInfo.firstName !== "" &&
            chatItem.receiverInfo.lastName !== ""
              ? chatItem.receiverInfo.firstName +
                " " +
                chatItem.receiverInfo.lastName
              : "Unknown name",

          membersGroup: 0,
          onlineGroup: 0,
          isOnline: isOnline
        };
  } else {
    top = isGroup
      ? {
          ava: "/assets/ava/default.png",
          name: "Unknown name",
          membersGroup: 0,
          onlineGroup: 0,
          isOnline: false
        }
      : {
          ava: "/assets/ava/default.png",
          name: "Unknown name",
          membersGroup: 0,
          onlineGroup: 0,
          isOnline: false
        };
  }

  // useEffect(() => {
  //   const fetchMessage = async () => {
  //     if (!id) return;
  //     const boxMessages = await fetchMessages(id.toString());
  //     if (boxMessages) {
  //       const segmentAdmin = boxMessages
  //         ? boxMessages.filter((item) => item.createBy === adminId)
  //         : [];
  //       setFilteredSegmentAdmin(segmentAdmin);
  //       const segmentOther = boxMessages
  //         ? boxMessages.filter((item) => item.createBy !== adminId)
  //         : [];
  //       setFilteredSegmentOther(segmentOther);
  //       setMessagesByBox((prev) => ({
  //         ...prev,
  //         [id.toString()]: boxMessages
  //       }));
  //     }
  //   };
  //   fetchMessage();
  // }, [ongoingGroupCall, id]);

  const filteredSegmentAdmin = messagesByBox[boxId]
    ? messagesByBox[boxId].filter((item) => item.createBy === adminId)
    : [];
  const filteredSegmentOther = messagesByBox[boxId]
    ? messagesByBox[boxId].filter((item) => item.createBy !== adminId)
    : [];
  //OpenMoreDisplay
  const display = {
    detailByBox: chatItem,
    relation,
    setRelation
  };
  const handleUnBlockChat = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("adminId");

      // Kiểm tra xem receiverId và senderId có tồn tại hay không
      if (!chatItem?.receiverInfo._id || !userId) {
        alert("Lỗi: Không có ID người nhận hoặc người gửi.");
        return;
      }

      // Tạo đối tượng params theo kiểu FriendRequestDTO
      const params: FriendRequestDTO = {
        sender: userId ? userId : "",
        receiver: chatItem?.receiverInfo._id || ""
      };

      await unBlockFr(params, setListBlockedFriend);
      setRelation("stranger"); // Hoặc bạn có thể thay thế với giá trị mới mà bạn muốn
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!chatItem) {
      return; // Nếu chưa có chatItem, không thực hiện gì
    }
    setMemberList(chatItem.memberInfo);
    setCreateBy(chatItem.createBy);
    let isMounted = true;
    const userId = localStorage.getItem("adminId");

    const check = async () => {
      try {
        if (userId) {
          const res: any = await checkRelation(
            userId,
            chatItem?.receiverInfo._id
          );
          if (isMounted) {
            if (!res) {
              setRelation("stranger");
            } else {
              const { relation, status, sender, receiver } = res;

              if (relation === "bff") {
                if (status) {
                  setRelation("bff"); //
                } else if (userId === sender) {
                  setRelation("sent_bff"); //
                } else if (userId === receiver) {
                  setRelation("received_bff"); //
                }
              } else if (relation === "friend") {
                setRelation("friend");
              } else if (relation === "block") {
                if (userId === sender) {
                  setRelation("blocked"); //
                } else if (userId === receiver) {
                  setRelation("blockedBy");
                }
              } else {
                setRelation("stranger"); //
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching relation:", error);
      }
    };
    if (!isGroup) {
      check();
    }
    return () => {
      isMounted = false;
    };
  }, [chatItem]);
  useEffect(() => {
    // Gọi API lấy danh sách bạn bè khi component mount
    const fetchData = async () => {
      try {
        await getMyListFriend(setListFriend, setError);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!chatItem) {
    return (
      <div className="flex h-screen w-screen items-center justify-center background-light900_dark400">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-row w-full h-full">
        <div
          className={`${
            openMore ? (isParagraphVisible ? "w-[65%]" : "w-[70%]") : "w-full"
          } background-light900_dark400 rounded-tr-[12px] rounded-br-[12px] pl-[16px] rounded-tl-[0px] rounded-bl-[0px]`}
        >
          <div
            className={`flex flex-col flex-1 w-full py-[16px] lg:px-[12px] pr-[12px] justify-between h-full`}
          >
            {!isGroup ? (
              relation === "" ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="loader"></div>
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : relation === "blockedBy" ? (
                <>
                  <RightTop top={top} />
                  <RightMiddle
                    filteredSegmentAdmin={filteredSegmentAdmin}
                    filteredSegmentOther={filteredSegmentOther}
                    receiverInfo={chatItem ? chatItem.memberInfo : []}
                    relation={relation}
                  />
                  <div className="flex flex-col items-center justify-center w-full h-20 border-t border-border-color text-dark100_light900">
                    <p className="text-sm">Your are blocked.</p>
                  </div>
                </>
              ) : relation === "blocked" ? (
                <>
                  <RightTop top={top} />
                  <RightMiddle
                    filteredSegmentAdmin={filteredSegmentAdmin}
                    filteredSegmentOther={filteredSegmentOther}
                    receiverInfo={chatItem ? chatItem.memberInfo : []}
                    relation={relation}
                  />
                  <div className="flex flex-col items-center justify-center w-full border-t border-border-color text-dark100_light900">
                    <p className="text-sm p-4">You blocked this person.</p>
                    <button
                      className="text-sm cursor-pointer text-blue-500 hover:bg-opacity-30 hover:bg-border-color rounded-md shadow-none w-full p-2"
                      onClick={handleUnBlockChat}
                    >
                      Unblock
                    </button>
                    <button
                      className="text-sm cursor-pointer text-red-500 hover:bg-opacity-30 hover:bg-border-color rounded-md shadow-none w-full p-2"
                      onClick={() => setReport(true)}
                    >
                      Report
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <RightTop top={top} />

                  <RightMiddle
                    filteredSegmentAdmin={filteredSegmentAdmin}
                    filteredSegmentOther={filteredSegmentOther}
                    receiverInfo={chatItem ? chatItem.memberInfo : []}
                  />

                  <RightBottom
                    recipientIds={chatItem.memberInfo.map(
                      (item: any) => item.id
                    )}
                    relation={relation}
                  />
                </>
              )
            ) : (
              <>
                <RightTop top={top} />

                <RightMiddle
                  filteredSegmentAdmin={filteredSegmentAdmin}
                  filteredSegmentOther={filteredSegmentOther}
                  receiverInfo={chatItem ? chatItem.memberInfo : []}
                />

                <RightBottom
                  recipientIds={chatItem.memberInfo.map((item: any) => item.id)}
                  relation={relation}
                />
              </>
            )}
          </div>
        </div>
        <OpenMoreDisplay display={display} />
      </div>

      {isReport && (
        <ReportCard onClose={onclose} type="Message" reportedId={chatItem.id} />
      )}
    </>
  );
};

export default RightMessage;
