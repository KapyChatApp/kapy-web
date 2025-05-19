import { DetailCalling } from "@/lib/DTO/message";
import { editMessage } from "@/lib/services/message/edit";
import { handleSendTextMessage } from "@/lib/services/message/send/sendText";
import { OngoingGroupCall } from "@/types/group-call";
import { OngoingCall } from "@/types/socket";

type SendCallSummaryParams = {
  ongoingCall?: OngoingCall | null;
  ongoingGroupCall?: OngoingGroupCall | null;
  detailCalling: DetailCalling;
  participants: string[];
  groupBoxId?: string;
  groupCaller?: string;
};

export const sendCallSummaryMessage = async ({
  ongoingCall,
  ongoingGroupCall,
  detailCalling,
  participants,
  groupBoxId,
  groupCaller
}: SendCallSummaryParams) => {
  const messageContent = "__CALL__:" + JSON.stringify(detailCalling);

  ongoingCall &&
    (await handleSendTextMessage(
      messageContent,
      ongoingCall.participants.boxId,
      participants,
      ongoingCall.participants.caller.userId
    ));

  ongoingGroupCall &&
    (await handleSendTextMessage(
      messageContent,
      ongoingGroupCall.participantsGroup.groupDetails._id,
      participants,
      ongoingGroupCall.participantsGroup.caller.userId
    ));

  groupBoxId &&
    groupCaller &&
    (await handleSendTextMessage(
      messageContent,
      groupBoxId,
      participants,
      groupCaller
    ));

  console.log("Message is sent");
};

export const editCallSummaryMessage = async (
  detailCalling: DetailCalling,
  userHangup: string
) => {
  const messageContent = "__CALL__:" + JSON.stringify(detailCalling);
  const localId = localStorage.getItem("editedMessageId");
  if (!localId) {
    console.error("Edited message id is missing");
    return;
  }
  await editMessage({
    messageId: localId,
    newContent: messageContent,
    userHangup: userHangup
  });
};
