import {
  ManagementGroup,
  MessageBoxProps,
  SegmentMessProps
} from "@/types/mess-group";

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

export const segmentsGroup: SegmentMessProps[] = [
  {
    groupId: "1",
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: "Exploring the wonders of nature!",
    time: new Date("2024-10-10T08:30:00")
  },
  {
    groupId: "1",
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: "Hello everyone!",
    time: new Date("2024-10-10T08:32:00")
  },
  {
    groupId: "1",
    userId: "2",
    userName: "MasterD",
    ava: "/assets/ava/ava2.jpg",
    content: "Just finished a 10K marathon!",
    time: new Date("2024-10-10T09:00:00")
  },
  {
    groupId: "1",
    userId: "3",
    userName: "Annie",
    ava: "/assets/ava/ava3.jpg",
    content: {
      type: "image",
      url: "/assets/ava/48.jpg"
    },
    time: new Date("2024-10-10T09:15:00")
  },
  {
    groupId: "1",
    userId: "4",
    userName: "Sam",
    ava: "/assets/ava/48.jpg",
    content: {
      type: "link",
      url: "https://www.nature.com"
    },
    time: new Date("2024-10-10T09:30:00")
  },
  {
    groupId: "2",
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: "Loving the new JavaScript features.",
    time: new Date("2024-10-10T10:00:00")
  },
  {
    groupId: "2",
    userId: "2",
    userName: "MasterD",
    ava: "/assets/ava/ava2.jpg",
    content: {
      type: "file",
      fileName: "project_docs.pdf",
      fileUrl: "/files/project_docs.pdf",
      fileType: "application/pdf"
    },
    time: new Date("2024-10-10T10:30:00")
  },
  {
    groupId: "2",
    userId: "2",
    userName: "MasterD",
    ava: "/assets/ava/ava2.jpg",
    content: "Attending a leadership workshop.",
    time: new Date("2024-10-10T10:45:00")
  },
  {
    groupId: "3",
    userId: "4",
    userName: "Sam",
    ava: "",
    content: {
      type: "image",
      url: "/assets/ava/48.jpg"
    },
    time: new Date("2024-10-10T11:00:00")
  },
  {
    groupId: "3",
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: "Reading a fantastic book on leadership.",
    time: new Date("2024-10-10T11:30:00")
  },
  {
    groupId: "3",
    userId: "2",
    userName: "MasterD",
    ava: "/assets/ava/ava3.jpg",
    content: {
      type: "link",
      url: "https://www.techconference.com"
    },
    time: new Date("2024-10-10T11:45:00")
  },
  {
    groupId: "3",
    userId: "3",
    userName: "Annie",
    ava: "/assets/ava/48.jpg",
    content: {
      type: "file",
      fileName: "event_schedule.docx",
      fileUrl: "/files/event_schedule.docx",
      fileType: "application/docx"
    },
    time: new Date("2024-10-10T12:00:00")
  },
  {
    groupId: "1",
    userId: "001",
    userName: "Quynh Anh",
    ava: "/assets/ava/ava1.jpg",
    content: "I am an admin.",
    time: new Date("2024-10-10T12:30:00")
  },
  {
    groupId: "2",
    userId: "001",
    userName: "Quynh Anh",
    ava: "/assets/ava/ava1.jpg",
    content: "I am in group 2.",
    time: new Date("2024-10-10T13:00:00")
  },
  {
    groupId: "1",
    userId: "4",
    userName: "Sam",
    ava: "/assets/ava/ava3.jpg",
    content: "New task assigned for next sprint.",
    time: new Date("2024-10-10T13:30:00")
  },
  {
    groupId: "3",
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: {
      type: "link",
      url: "https://www.bookstore.com"
    },
    time: new Date("2024-10-10T14:00:00")
  }
];
