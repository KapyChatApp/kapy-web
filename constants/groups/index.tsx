import { ManagementGroup, MessageBoxProps } from "@/types/mess-group";
import { SegmentGroupProps } from "@/types/mess-group";

export const manage: ManagementGroup[] = [
  {
    id: "Change",
    label: "Change avatar and name of group"
  },
  {
    id: "send",
    label: "Send message"
  },
  {
    id: "add",
    label: "Add members"
  }
];

export const boxGroup: MessageBoxProps[] = [
  {
    id: "1",
    otherName: "Group ATSH",
    otherId: "1",
    ava: "/assets/ava/ava1.jpg",
    sender: "Junnie",
    content: "Hello I am Hello I am Hello I am Hello I am a girl in your life",
    pin: true,
    time: "4 min",
    isOnline: true,
    isSeen: true
  },
  {
    id: "2",
    otherId: "2",
    otherName: "Study group",
    ava: "/assets/ava/ava2.jpg",
    sender: "Junnie",
    content: "Hello ",
    pin: false,
    time: "4 min",
    isOnline: true,
    isSeen: true
  },
  {
    id: "3",
    otherId: "3",
    otherName: "Team A",
    ava: "/assets/ava/ava2.jpg",
    sender: "MasterD",
    content: "Hello",
    pin: false,
    time: "4 min",
    isOnline: false,
    isSeen: false
  }
];

export const segmentsGroup: SegmentGroupProps[] = [
  {
    groupId: "1",
    userId: "1",
    userName: "Junnie",
    userAva: "/assets/ava/48.jpg",
    ava: "/assets/ava/ava1.jpg",
    content: "Exploring the wonders of nature!"
  },
  {
    groupId: "1",
    userId: "2",
    userName: "MasterD",
    userAva: "/assets/ava/ava3.jpg",
    ava: "/assets/ava/ava2.jpg",
    content: "Just finished a 10K marathon!"
  },
  {
    groupId: "2",
    userId: "3",
    userName: "Annie",
    userAva: "/assets/ava/48.jpg",
    ava: "/assets/ava/ava1.jpg",
    content: "Loving the new JavaScript features."
  },
  {
    groupId: "3",
    userId: "1",
    userName: "Junnie",
    userAva: "/assets/ava/ava3.jpg",
    ava: "/assets/ava/ava1.jpg",
    content: "Reading a fantastic book on leadership."
  },
  {
    groupId: "2",
    userId: "1",
    userName: "Junnie",
    userAva: "/assets/ava/ava1.jpg",
    ava: "/assets/ava/ava2.jpg",
    content: "Reading a fantastic book on leadership."
  },
  {
    groupId: "1",
    userId: "001",
    userName: "Quynh Anh",
    userAva: "/assets/ava/ava1.jpg",
    ava: "/assets/ava/ava1.jpg",
    content: "I am an admin."
  },
  {
    groupId: "2",
    userId: "001",
    userName: "Quynh Anh",
    userAva: "/assets/ava/ava1.jpg",
    ava: "/assets/ava/ava1.jpg",
    content: "I am in group 2."
  }
];
