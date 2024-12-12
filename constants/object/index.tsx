import { Group, User } from "@/types/object";
import { photo } from "../media";

export const user: User[] = [
  {
    id: "1",
    name: "Junnie",
    ava: "/assets/ava/ava1.jpg",
    background: "/assets/ava/ava1.jpg",
    image: photo,
    mutualFriend: 2,
    mutualGroup: 2,
    status: "best",
    birth: new Date("04/12/1998"), // Ngày sinh
    bio: "Loves to travel and meet new friends.", // Tiểu sử
    phone: "+1234580" // Số điện thoại
  },
  {
    id: "2",
    name: "MasterD",
    ava: "/assets/ava/ava2.jpg",
    background: "/assets/ava/ava2.jpg",
    image: photo,
    mutualFriend: 4,
    mutualGroup: 2,
    status: "best",
    birth: new Date("03/05/1997"), // Ngày sinh
    bio: "Tech enthusiast and gamer.", // Tiểu sử
    phone: "+1234581" // Số điện thoại
  },
  {
    id: "3",
    name: "Annie",
    ava: "/assets/ava/ava3.jpg",
    background: "/assets/ava/ava1.jpg",
    image: photo,
    mutualFriend: 0,
    mutualGroup: 0,
    status: "friend",
    birth: new Date("06/22/2000"), // Ngày sinh
    bio: "Loves reading and painting.", // Tiểu sử
    phone: "+1234582" // Số điện thoại
  },
  {
    id: "4",
    name: "Esther",
    ava: "/assets/ava/ava2.jpg",
    background: "/assets/ava/ava1.jpg",
    image: photo,
    mutualFriend: 7,
    mutualGroup: 2,
    status: "friend",
    birth: new Date("01/15/1999"), // Ngày sinh
    bio: "Passionate about music and arts.", // Tiểu sử
    phone: "+1234583" // Số điện thoại
  },
  {
    id: "5",
    name: "Jeong Dan",
    ava: "/assets/ava/ava3.jpg",
    background: "/assets/ava/ava2.jpg",
    image: photo,
    mutualFriend: 9,
    mutualGroup: 0,
    status: "best",
    birth: new Date("09/29/1995"), // Ngày sinh
    bio: "Food lover and chef.", // Tiểu sử
    phone: "+1234584" // Số điện thoại
  },
  {
    id: "6",
    name: "Junyoung",
    ava: "/assets/ava/48.jpg",
    background: "/assets/ava/ava1.jpg",
    image: photo,
    mutualFriend: 6,
    mutualGroup: 2,
    status: "best",
    birth: new Date("12/08/1996"), // Ngày sinh
    bio: "Enthusiastic about sports and fitness.", // Tiểu sử
    phone: "+1234585" // Số điện thoại
  },
  {
    id: "7",
    name: "HAHA",
    ava: "/assets/ava/ava3.jpg",
    background: "/assets/ava/ava2.jpg",
    image: photo,
    mutualFriend: 9,
    mutualGroup: 0,
    status: "block",
    birth: new Date("02/02/2001"), // Ngày sinh
    bio: "Humor and fun are my life.", // Tiểu sử
    phone: "+1234586" // Số điện thoại
  },
  {
    id: "8",
    name: "HIHI",
    ava: "/assets/ava/48.jpg",
    background: "/assets/ava/ava1.jpg",
    image: photo,
    mutualFriend: 6,
    mutualGroup: 0,
    status: "block",
    birth: new Date("07/07/2000"), // Ngày sinh
    bio: "Always ready for an adventure!", // Tiểu sử
    phone: "+1234587" // Số điện thoại
  },
  {
    id: "9",
    name: "HIHI",
    ava: "",
    background: "/assets/ava/ava1.jpg",
    image: photo,
    mutualFriend: 6,
    mutualGroup: 1,
    status: "unfriend",
    birth: new Date("11/11/2000"), // Ngày sinh
    bio: "Life is short, make it sweet.", // Tiểu sử
    phone: "+1234588" // Số điện thoại
  },
  {
    id: "10",
    name: "HAHAhahaha",
    ava: "",
    background: "/assets/ava/ava2.jpg",
    image: photo,
    mutualFriend: 9,
    mutualGroup: 0,
    status: "block",
    birth: new Date("02/02/2001"), // Ngày sinh
    bio: "Humor and fun are my life.", // Tiểu sử
    phone: "+1234586" // Số điện thoại
  },
  {
    id: "11",
    name: "HIHIhihihi",
    ava: "",
    background: "/assets/ava/ava1.jpg",
    image: photo,
    mutualFriend: 6,
    mutualGroup: 0,
    status: "block",
    birth: new Date("07/07/2000"), // Ngày sinh
    bio: "Always ready for an adventure!", // Tiểu sử
    phone: "+1234587" // Số điện thoại
  },
  {
    id: "12",
    name: "Anhouufe",
    ava: "",
    background: "/assets/ava/ava1.jpg",
    image: photo,
    mutualFriend: 6,
    mutualGroup: 0,
    status: "block",
    birth: new Date("07/07/2000"), // Ngày sinh
    bio: "Always ready for an adventure!", // Tiểu sử
    phone: "+1234587" // Số điện thoại
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
