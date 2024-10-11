import { MessageBoxProps } from "@/types/mess-group";
import { SegmentMessProps } from "@/types/mess-group";

export const box: MessageBoxProps[] = [
  {
    id: "1",
    otherName: "Junnie",
    otherId: "1",
    ava: "/assets/ava/ava1.jpg",
    content: "Hello I am Hello I am Hello I am Hello I am a girl in your life",
    sender: "You",
    pin: true,
    time: "4 min",
    isOnline: true,
    isSeen: true
  },
  {
    id: "2",
    otherName: "MasterD",
    otherId: "2",
    ava: "/assets/ava/ava2.jpg",
    content: "Hello",
    sender: "MasterD",
    pin: false,
    time: "4 min",
    isOnline: true,
    isSeen: true
  },
  {
    id: "3",
    otherName: "Annie",
    otherId: "3",
    ava: "/assets/ava/ava3.jpg",
    content: "Hello",
    sender: "Annie",
    pin: false,
    time: "4 min",
    isOnline: false,
    isSeen: false
  }
];

export const segmentsMess: SegmentMessProps[] = [
  {
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: "Hello admin!",
    time: new Date("2024-10-11T08:20:00")
  },
  {
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: "Exploring the wonders of nature!",
    time: new Date("2024-10-11T08:30:00")
  },
  {
    userId: "2",
    userName: "MasterD",
    ava: "/assets/ava/ava2.jpg",
    content: {
      type: "image",
      url: "/assets/ava/48.jpg",
      altText: "MasterD after completing a marathon"
    },
    time: new Date("2024-10-11T09:00:00")
  },
  {
    userId: "001", // Admin
    userName: "Quynh Anh",
    ava: "/assets/ava/ava1.jpg",
    content: "Reminder: Please submit your reports.",
    time: new Date("2024-10-11T09:30:00"),
    recipientId: "2" // Gửi cho user MasterD (id: 2)
  },
  {
    userId: "001", // Admin
    userName: "Quynh Anh",
    ava: "/assets/ava/ava1.jpg",
    content: "System maintenance will happen tonight.",
    time: new Date("2024-10-11T10:00:00"),
    recipientId: "1" // Gửi cho user Junnie (id: 1)
  },
  {
    userId: "3",
    userName: "Annie",
    ava: "/assets/ava/ava3.jpg",
    content: "Loving the new JavaScript features.",
    time: new Date("2024-10-11T09:15:00")
  },
  {
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: {
      type: "file",
      fileName: "leadership-book.pdf",
      fileUrl: "/assets/files/leadership-book.pdf",
      fileType: "application/pdf"
    },
    time: new Date("2024-10-11T10:00:00")
  },
  {
    userId: "001", // Admin
    userName: "Quynh Anh",
    ava: "/assets/ava/ava1.jpg",
    content: "System update completed.",
    time: new Date("2024-10-11T11:00:00"),
    recipientId: "3" // Gửi cho user Annie (id: 3)
  }
];
