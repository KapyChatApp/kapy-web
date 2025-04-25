import { DetailCalling } from "@/lib/DTO/message";
import { handleSendTextMessage } from "@/lib/services/message/send/sendText";
import { OngoingCall } from "@/types/socket";

type SendCallSummaryParams = {
  ongoingCall: OngoingCall | null;
  detailCalling: DetailCalling;
  participants: string[];
};

export const sendCallSummaryMessage = async ({
  ongoingCall,
  detailCalling,
  participants
}: SendCallSummaryParams) => {
  if (!ongoingCall) return;
  const messageContent = "__CALL__:" + JSON.stringify(detailCalling);

  await handleSendTextMessage(
    messageContent,
    ongoingCall.participants.boxId,
    participants,
    ongoingCall.participants.caller.userId
  );

  console.log("Message is sent");
};
