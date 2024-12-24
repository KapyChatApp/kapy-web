"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import RightTop from "./RightTop";
import RightBottom from "./RightBottom";
import RightMiddle from "./RightMiddle";
import OpenMoreDisplay from "./OpenMoreDisplay";
import { useChatContext } from "@/context/ChatContext";
import { useUserContext } from "@/context/UserContext";
import { MessageBoxInfo, ReadedStatusPusher } from "@/lib/DTO/message";
import { FriendRequestDTO } from "@/lib/DTO/friend";
import { unBlockFr } from "@/lib/services/friend/unblock";
import { useFriendContext } from "@/context/FriendContext";
import { checkRelation } from "@/lib/services/user/checkRelation";
import ReportCard from "@/components/shared/ReportCard";
import { getRealTimeOfUser } from "@/lib/services/user/getRealTime";
import { getPusherClient } from "@/lib/pusher";

interface RightMessageProps {
  chatItem: MessageBoxInfo | undefined;
}

const RightMessage = ({ chatItem }: RightMessageProps) => {
  const pathname = usePathname();
  const [openMore, setOpenMore] = useState(false);
  const [isReport, setReport] = useState(false);
  const isGroup = pathname.startsWith("/group-chat");

  //FetchMessage Backend
  const { id } = useParams();
  const [relation, setRelation] = useState("");
  const { adminInfo, isOnlineChat, setTimeOfflineChat, setIsOnlineChat } =
    useUserContext();
  const { setListBlockedFriend } = useFriendContext();
  const { setReadedIdByBox, dataChat, messagesByBox } = useChatContext();
  const adminId = adminInfo._id;

  const onclose = () => {
    setReport(false);
  };

  //boxId
  const [boxId, setBoxId] = useState<string>("");
  useEffect(() => {
    // Lấy đường dẫn hiện tại từ URL
    const path = window.location.pathname;
    // Chia đường dẫn thành các phần và lấy phần cuối cùng (boxId)
    const parts = path.split("/");
    const id = parts.pop(); // Lấy phần cuối cùng của đường dẫn

    if (id) {
      setBoxId(id); // Set boxId là chuỗi
    }
  }, [boxId]);

  // useEffect(() => {
  //   const getMessage = async () => {
  //     try {
  //       if (id) {
  //         // Kiểm tra nếu boxId tồn tại
  //         const messagesMap: Record<string, ResponseMessageDTO[]> = {};

  //         for (const box of dataChat) {
  //           const boxMessages = await fetchMessages(box.id);
  //           messagesMap[box.id] = boxMessages;
  //         }
  //         setMessagesByBox(messagesMap);
  //       } else {
  //         console.warn("boxId is undefined");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   const fetchImageList = async () => {
  //     try {
  //       if (id) {
  //         // Kiểm tra nếu boxId tồn tại
  //         const list: FileContent[] = await getFileList(id.toString());
  //         setFileList(list);
  //       } else {
  //         console.warn("boxId is undefined");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getMessage();
  //   fetchImageList();
  // }, []);

  //Online Status

  useEffect(() => {
    if (!chatItem) {
      return;
    }

    const fetchRealTimeData = async () => {
      for (const user of chatItem.memberInfo) {
        try {
          const data = await getRealTimeOfUser(user._id);
          if (data) {
            if (!data.isOnline) {
              setTimeOfflineChat((prev) => ({
                ...prev,
                [user._id]: data.updateTime // Lưu thời gian cập nhật
              }));
            }
            setIsOnlineChat((prevState) => ({
              ...prevState,
              [user._id]: data.isOnline
            }));
          } else {
            setIsOnlineChat((prevState) => ({
              ...prevState,
              [user._id]: false
            }));
          }
        } catch (error) {
          console.error(
            `Failed to fetch real-time data for user ${user._id}:`,
            error
          );
        }
      }
    };

    fetchRealTimeData();
  }, []);

  //Read status
  useEffect(() => {
    const pusherClient = getPusherClient();

    const handleReadedId = (data: ReadedStatusPusher) => {
      console.log("Successfully received readed-status:", data);
      setReadedIdByBox((prevState) => ({
        ...prevState,
        [data.boxId]: data.readedId
      }));
    };

    dataChat.forEach((box) => {
      pusherClient.subscribe(`private-${box.id}`);
      pusherClient.bind("readed-status", handleReadedId);
    });
  });

  //Right Top
  let top: any;
  if (id && chatItem) {
    const isOnlineGroup = chatItem.memberInfo.some(
      (member) => isOnlineChat[member._id]
    );
    const isOnline = isOnlineChat[chatItem.receiverInfo._id];
    top = isGroup
      ? {
          _id: chatItem.id,
          ava: chatItem.groupAva
            ? chatItem.groupAva
            : "/assets/images/icon.png",
          name: chatItem.groupName ? chatItem.groupName : "Group Chat",
          membersGroup: chatItem.memberInfo.length,
          onlineGroup: chatItem.memberInfo.filter(
            (member) => isOnlineChat[member._id]
          ).length,
          openMore: openMore,
          setOpenMore: setOpenMore,
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
          openMore: openMore,
          setOpenMore: setOpenMore,
          isOnline: isOnline
        };
  } else {
    top = isGroup
      ? {
          ava: "/assets/ava/default.png",
          name: "Unknown name",
          membersGroup: 0,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore,
          isOnline: false
        }
      : {
          ava: "/assets/ava/default.png",
          name: "Unknown name",
          membersGroup: 0,
          onlineGroup: 0,
          openMore: openMore,
          setOpenMore: setOpenMore,
          isOnline: false
        };
  }
  //filterSegment
  const filteredSegmentAdmin = messagesByBox[boxId]
    ? messagesByBox[boxId].filter((item) => item.createBy === adminId)
    : [];
  const filteredSegmentOther = messagesByBox[boxId]
    ? messagesByBox[boxId].filter((item) => item.createBy !== adminId)
    : [];

  //OpenMoreDisplay
  const display = {
    detailByBox: chatItem,
    openMore,
    setOpenMore,
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

  if (!chatItem) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-row w-full h-full">
        <div
          className={`${
            openMore ? "w-[65%]" : "w-full"
          } background-light900_dark400 rounded-tr-[12px] rounded-br-[12px] pl-[16px] rounded-tl-[12px] rounded-bl-[12px] lg:rounded-tl-[0px] lg:rounded-bl-[0px] md:rounded-tl-[0px] md:rounded-bl-[0px]`}
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
