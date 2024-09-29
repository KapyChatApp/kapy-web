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
    ava: "/assets/ava/ava1.jpg",
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
    content: "Exploring the wonders of nature!"
  },
  {
    userId: "2",
    userName: "MasterD",
    ava: "/assets/ava/ava2.jpg",
    content: "Just finished a 10K marathon!"
  },
  {
    userId: "3",
    userName: "Annie",
    ava: "/assets/ava/ava1.jpg",
    content: "Loving the new JavaScript features."
  },
  {
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: "Reading a fantastic book on leadership."
  },
  {
    userId: "1",
    userName: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    content: "Reading a fantastic book on leadership."
  },
  {
    userId: "001",
    userName: "Quynh Anh",
    ava: "/assets/ava/ava1.jpg",
    content: "I am an admin."
  }
];
