"use client";
import { Button } from "@/components/ui/button";
import { useFriendContext } from "@/context/FriendContext";
import {
  FriendProfileResponseDTO,
  FriendRequestDTO,
  FriendResponseDTO
} from "@/lib/DTO/friend";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import { unFriend } from "@/lib/services/friend/unfriend";
import { useUserContext } from "@/context/UserContext";
import ConfirmModal, { ConfirmModalProps } from "../ConfirmModal";
import { addBestFriendRequest } from "@/lib/services/friend/addBff";
import { unBestFriend } from "@/lib/services/friend/unBff";
import { addFriendRequest } from "@/lib/services/friend/addFriend";
import { acceptFriend } from "@/lib/services/friend/acceptFriend";
import { acceptBestFriend } from "@/lib/services/friend/accepBff";
import {
  confirmHandleUnBff,
  confirmHandleUnfr,
  handleAcceptBff,
  handleAcceptFr,
  handleAddBff,
  handleAddfr,
  handleMessage,
  handleUnBff,
  handleUnfr
} from "@/lib/utils";
import { findBoxChat } from "@/lib/services/message/findBoxChat";
import { RequestCreateGroup } from "@/lib/DTO/message";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/context/ChatContext";

interface FirstItemProps {
  user: FriendProfileResponseDTO;
}

// stranger
//block
// friend
// bff
// sent_bff
// received_bff
// sent_friend
// received_friend

const FirstItem = ({ user }: FirstItemProps) => {
  const defaultConfirm: ConfirmModalProps = {
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  };
  const { adminInfo } = useUserContext();
  const {
    setListFriend,
    setListBestFriend,
    setListBlockedFriend,
    setListRequestedFriend
  } = useFriendContext();
  const [relation, setRelation] = useState(user.relation);
  const [isConfirm, setIsConfirm] = useState(false);
  const [error, setError] = useState("");
  const { dataChat, setDataChat } = useChatContext();
  const [confirm, setConfirm] = useState<ConfirmModalProps>(defaultConfirm);
  const param: FriendRequestDTO = {
    sender: adminInfo._id,
    receiver: user._id
  };
  const friendRequest: FriendRequestDTO = {
    sender: user._id,
    receiver: adminInfo._id
  };

  const router = useRouter();
  const handleRouteMessage = async () => {
    console.log("hello");
    const response = await findBoxChat(user._id);
    if (!response) {
      const param: RequestCreateGroup = {
        membersIds: [user._id],
        groupName: ""
      };
      //param, groupAva, setDataChat, setError
      handleMessage(param, undefined, setDataChat, setError, router);
    } else {
      router.push(`/${response}`);
    }
  };

  useEffect(() => {
    setRelation(user.relation);
  }, [user.relation]);

  const renderActionButton = () => {
    switch (relation) {
      case "friend": {
        const param1 = {
          label: "Add Bff",
          icon: "mingcute:add-fill",
          colorBackground: "bg-primary-500",
          colorText: "text-light-900",
          handleAction: () => handleAddBff(param, setRelation)
        };
        const param2 = {
          label: "Unfriend",
          icon: "mingcute:user-x-line",
          colorBackground: "background-light700_dark400",
          colorText: "text-dark100_light900",
          handleAction: () =>
            confirmHandleUnfr(
              setIsConfirm,
              setConfirm,
              user,
              param,
              setListFriend,
              setRelation
            )
        };

        return (
          <>
            <ActionButton params={param1} />
            <ActionButton params={param2} />
          </>
        );
      }
      case "bff": {
        const param1 = {
          label: "UnBff",
          icon: "mingcute:user-x-line",
          colorBackground: "bg-primary-500",
          colorText: "text-light-900",
          handleAction: () =>
            confirmHandleUnBff(
              setIsConfirm,
              setConfirm,
              user,
              param,
              setListBestFriend,
              setRelation
            )
        };
        const param2 = {
          label: "Unfriend",
          icon: "mingcute:user-x-line",
          colorBackground: "background-light700_dark400",
          colorText: "text-dark100_light900",
          handleAction: () =>
            confirmHandleUnfr(
              setIsConfirm,
              setConfirm,
              user,
              param,
              setListFriend,
              setRelation
            )
        };

        return (
          <>
            <ActionButton params={param1} />
            <ActionButton params={param2} />
          </>
        );
      }
      case "sent_bff": {
        const param1 = {
          label: "Unrequest",
          icon: "",
          colorBackground: "bg-primary-500",
          colorText: "text-light-900",
          handleAction: () => handleUnBff(param, setListBestFriend, setRelation)
        };
        const param2 = {
          label: "Unfriend",
          icon: "mingcute:user-x-line",
          colorBackground: "background-light700_dark400",
          colorText: "text-dark100_light900",
          handleAction: () => handleUnfr(param, setListFriend, setRelation)
        };

        return (
          <>
            <ActionButton params={param1} />
            <ActionButton params={param2} />
          </>
        );
      }
      case "sent_friend": {
        const param1 = {
          label: "Unrequest",
          icon: "",
          colorBackground: "bg-primary-500",
          colorText: "text-light-900",
          handleAction: () => handleUnfr(param, setListFriend, setRelation)
        };
        const param2 = {
          label: "Message",
          icon: "",
          colorBackground: "background-light700_dark400",
          colorText: "text-dark100_light900",
          handleAction: () => handleRouteMessage()
        };

        return (
          <>
            <ActionButton params={param1} />
            <ActionButton params={param2} />
          </>
        );
      }
      case "received_friend": {
        const param1 = {
          label: "Accept",
          icon: "",
          colorBackground: "bg-primary-500",
          colorText: "text-light-900",
          handleAction: () =>
            handleAcceptFr(friendRequest, setListRequestedFriend, setRelation)
        };
        const param2 = {
          label: "Deny",
          icon: "",
          colorBackground: "background-light700_dark400",
          colorText: "text-dark100_light900",
          handleAction: () => handleUnfr(param, setListFriend, setRelation)
        };

        return (
          <>
            <ActionButton params={param1} />
            <ActionButton params={param2} />
          </>
        );
      }
      case "received_bff": {
        const param1 = {
          label: "Accept",
          icon: "",
          colorBackground: "bg-primary-500",
          colorText: "text-light-900",
          handleAction: () =>
            handleAcceptBff(friendRequest, setListRequestedFriend, setRelation)
        };
        const param2 = {
          label: "Deny",
          icon: "",
          colorBackground: "background-light700_dark400",
          colorText: "text-dark100_light900",
          handleAction: () => handleUnBff(param, setListBestFriend, setRelation)
        };

        return (
          <>
            <ActionButton params={param1} />
            <ActionButton params={param2} />
          </>
        );
      }
      default: {
        const param1 = {
          label: "Add friend",
          icon: "mingcute:add-fill",
          colorBackground: "bg-primary-500",
          colorText: "text-light-900",
          handleAction: () => handleAddfr(param, setRelation)
        };
        const param2 = {
          label: "Message",
          icon: "",
          colorBackground: "background-light700_dark400",
          colorText: "text-dark100_light900",
          handleAction: () => handleRouteMessage()
        };

        return (
          <>
            <ActionButton params={param1} />
            <ActionButton params={param2} />
          </>
        );
      }
    }
  };

  return (
    <>
      <div className="w-full h-fit relative px-4">
        {/* Background */}
        {!user.background ? (
          <div className="absolute top-0 left-0 w-full h-[129px] background-light500_dark400 z-0"></div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-[129px] z-0">
            <Image
              src={user.background}
              alt="background"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}

        <div className="w-full flex items-end justify-start relative z-10 h-fit">
          {/* Avatar */}
          <div className="mt-[112px] h-20 w-20 rounded-full overflow-hidden">
            <Image
              src={user.avatar ? user.avatar : "/assets/ava/default.png"}
              alt="ava"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Name and Buttons */}
          <div className="flex w-full items-center ml-3 mt-3 h-full">
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex flex-col w-fit items-start justify-start">
                <p className="text-dark100_light900 paragraph-regular">
                  {user.firstName + " " + user.lastName}
                </p>
                {user.mutualFriends.length > 0 && (
                  <p className="text-dark100_light900 subtle-light">
                    {user.mutualFriends.length} mutual friends
                  </p>
                )}
              </div>

              <div className="flex flex-row gap-2 w-fit">
                {renderActionButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};

export default FirstItem;
