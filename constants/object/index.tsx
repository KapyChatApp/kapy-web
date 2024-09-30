import { Group, User } from "@/types/object";

export const user: User[] = [
  {
    id: "1",
    name: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    background: "/assets/ava/ava1.jpg"
  },
  {
    id: "2",
    name: "MasterD",
    ava: "/assets/ava/ava2.jpg",
    background: "/assets/ava/ava2.jpg"
  },
  {
    id: "3",
    name: "Annie",
    ava: "/assets/ava/ava3.jpg",
    background: "/assets/ava/ava1.jpg"
  },
  {
    id: "4",
    name: "Esther",
    ava: "/assets/ava/ava2.jpg",
    background: "/assets/ava/ava1.jpg"
  },
  {
    id: "5",
    name: "Jeong Dan",
    ava: "/assets/ava/ava3.jpg",
    background: "/assets/ava/ava2.jpg"
  },
  {
    id: "6",
    name: "Junyoung",
    ava: "/assets/ava/48.jpg",
    background: "/assets/ava/ava1.jpg"
  }
];

export const group: Group[] = [
  {
    id: "1",
    name: "Group ATSH",
    ava: "/assets/ava/ava1.jpg",
    createdAt: "2024-09-19T10:30:00Z",
    createdBy: user[1],
    members: [
      {
        id: "1",
        username: "Junnie",
        ava: "/assets/ava/ava1.jpg",
        addedBy: "",
        isOnline: true
      },
      {
        id: "2",
        username: "MasterD",
        ava: "/assets/ava/ava2.jpg",
        addedBy: "Junnie",
        isOnline: true
      },
      {
        id: "3",
        username: "Annie",
        ava: "/assets/ava/48.jpg",
        addedBy: "MasterD",
        isOnline: true
      },
      {
        id: "4",
        username: "HaHa",
        ava: "/assets/ava/ava2.jpg",
        addedBy: "MasterD",
        isOnline: false
      },
      {
        id: "5",
        username: "Hahaha",
        ava: "/assets/ava/ava3.jpg",
        addedBy: "MasterD",
        isOnline: true
      }
    ]
  },
  {
    id: "2",
    name: "Study Group",
    ava: "/assets/ava/ava2.jpg",
    createdAt: "2024-09-19T10:30:00Z",
    createdBy: user[2],
    members: [
      {
        id: "1",
        username: "Junnie",
        ava: "/assets/ava/ava1.jpg",
        addedBy: "",
        isOnline: true
      },
      {
        id: "2",
        username: "MasterD",
        ava: "/assets/ava/ava1.jpg",
        addedBy: "Junnie",
        isOnline: true
      },
      {
        id: "3",
        username: "Annie",
        ava: "/assets/ava/ava1.jpg",
        addedBy: "MasterD",
        isOnline: true
      },
      {
        id: "4",
        username: "HaHa",
        ava: "/assets/ava/ava2.jpg",
        addedBy: "MasterD",
        isOnline: false
      },
      {
        id: "5",
        username: "Hahaha",
        ava: "/assets/ava/ava3.jpg",
        addedBy: "MasterD",
        isOnline: true
      }
    ]
  },
  {
    id: "3",
    name: "Team A",
    ava: "/assets/ava/ava2.jpg",
    createdAt: "2024-09-19T10:30:00Z",
    createdBy: user[3],
    members: [
      {
        id: "1",
        username: "Junnie",
        ava: "/assets/ava/ava1.jpg",
        addedBy: "Annie",
        isOnline: true
      },
      {
        id: "2",
        username: "MasterD",
        ava: "/assets/ava/ava2.jpg",
        addedBy: "Junnie",
        isOnline: true
      },
      {
        id: "3",
        username: "Annie",
        ava: "/assets/ava/48.jpg",
        addedBy: "",
        isOnline: true
      },
      {
        id: "4",
        username: "HaHa",
        ava: "/assets/ava/ava1.jpg",
        addedBy: "MasterD",
        isOnline: false
      }
    ]
  }
];
