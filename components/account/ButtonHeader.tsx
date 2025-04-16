"use client";
import { AccountData } from "@/types/account";
import React, { useEffect, useState } from "react";
import ActionButton from "../friends/AccountModalItems/ActionButton";
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
import ConfirmModal, { ConfirmModalProps } from "../friends/ConfirmModal";
import { defaultConfirm } from "@/constants";
import { FriendProfileResponseDTO, FriendRequestDTO } from "@/lib/DTO/friend";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/context/ChatContext";
import { useFriendContext } from "@/context/FriendContext";
import { useUserContext } from "@/context/UserContext";
import PersonalEdit from "../settings/Profile/PersonalEdit";

const ButtonHeader = ({ account }: { account: AccountData }) => {
  const { adminInfo } = useUserContext();
  const { setListFriend, setListBestFriend, setListRequestedFriend } =
    useFriendContext();
  const { setDataChat } = useChatContext();
  const router = useRouter();
  const param: FriendRequestDTO = {
    sender: adminInfo._id,
    receiver: account.data._id
  };
  const friendRequest: FriendRequestDTO = {
    sender: account.data._id,
    receiver: adminInfo._id
  };
  const [error, setError] = useState("");
  const [relation, setRelation] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>(defaultConfirm);
  const [isEdit, setIsEdit] = useState(false);
  const handleRouteMessage = async () => {
    const response = await findBoxChat(account.data._id);
    if (!response) {
      const param: RequestCreateGroup = {
        membersIds: [account.data._id],
        groupName: ""
      };
      //param, groupAva, setDataChat, setError
      handleMessage(param, undefined, setDataChat, setError, router);
    } else {
      router.push(`/${response}`);
    }
  };

  useEffect(() => {
    const FunctionSetRealation = () => {
      if ("relation" in account.data) {
        setRelation(account.data.relation);
      }
    };

    FunctionSetRealation();
  }, []);

  console.log("relation: ", relation);
  const renderActionButton = () => {
    if (account.type === "self") {
      const param = {
        label: "Edit profile",
        icon: "",
        colorBackground: "background-light500_dark500",
        colorText: "text-dark100_light900",
        handleAction: () => setIsEdit(true)
      };
      return (
        <>
          <ActionButton params={param} />
        </>
      );
    } else {
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
            colorBackground: "background-light500_dark500",
            colorText: "text-dark100_light900",
            handleAction: () =>
              confirmHandleUnfr(
                setIsConfirm,
                setConfirm,
                account.data as FriendProfileResponseDTO,
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
                account.data as FriendProfileResponseDTO,
                param,
                setListBestFriend,
                setRelation
              )
          };
          const param2 = {
            label: "Unfriend",
            icon: "mingcute:user-x-line",
            colorBackground: "background-light500_dark500",
            colorText: "text-dark100_light900",
            handleAction: () =>
              confirmHandleUnfr(
                setIsConfirm,
                setConfirm,
                account.data as FriendProfileResponseDTO,
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
            handleAction: () =>
              handleUnBff(param, setListBestFriend, setRelation)
          };
          const param2 = {
            label: "Unfriend",
            icon: "mingcute:user-x-line",
            colorBackground: "background-light500_dark500",
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
            colorBackground: "background-light500_dark500",
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
            colorBackground: "background-light500_dark500",
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
              handleAcceptBff(
                friendRequest,
                setListRequestedFriend,
                setRelation
              )
          };
          const param2 = {
            label: "Deny",
            icon: "",
            colorBackground: "background-light500_dark500",
            colorText: "text-dark100_light900",
            handleAction: () =>
              handleUnBff(param, setListBestFriend, setRelation)
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
            colorBackground: "background-light500_dark500",
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
    }
  };
  return (
    <>
      <section className="row-start-1 col-start-2 flex items-center gap-5 mb-5">
        <span className="h3-bold text-dark100_light900">
          {"mutualFriends" in account.data
            ? account.data.firstName
            : adminInfo.firstName}{" "}
          {"mutualFriends" in account.data
            ? account.data.lastName
            : adminInfo.lastName}
        </span>
        {renderActionButton()}
      </section>

      {isConfirm && <ConfirmModal confirm={confirm} />}

      {isEdit && <PersonalEdit setIsEdit={setIsEdit} />}
    </>
  );
};

export default ButtonHeader;
