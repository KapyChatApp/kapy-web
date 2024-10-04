import {
  HistoryFindFriend,
  OtherBoxButtonProps,
  StrangeFriend
} from "@/types/friends";
import { photo } from "../media";

export const otherBox: OtherBoxButtonProps[] = [
  {
    icon: "solar:heart-bold",
    label: "Best friend"
  },
  {
    icon: "tabler:friends-off",
    label: "Unfriend"
  },
  {
    icon: "material-symbols:block",
    label: "Block"
  }
];

export const strangeFriend: StrangeFriend[] = [
  {
    id: "1",
    name: "John Doe",
    ava: "/assets/ava/ava1.jpg",
    background: "",
    image: photo,
    mutualFriend: 5,
    mutualGroup: 1,
    status: "invite",
    birth: new Date("04/15/1990"), // Ngày sinh
    bio: "A friendly person who loves adventures.", // Tiểu sử
    phone: "+1234567890" // Số điện thoại
  },
  {
    id: "2",
    name: "Jane Smith",
    ava: "/assets/ava/ava2.jpg",
    background: "",
    image: photo,
    mutualFriend: 8,
    mutualGroup: 1,
    status: "suggest",
    birth: new Date("06/20/1992"), // Ngày sinh
    bio: "Passionate about photography and travel.", // Tiểu sử
    phone: "+1234567891" // Số điện thoại
  },
  {
    id: "3",
    name: "Robert Johnson",
    ava: "/assets/ava/ava3.jpg",
    background: "",
    image: photo,
    mutualFriend: 10,
    mutualGroup: 1,
    status: "suggest",
    birth: new Date("02/10/1988"), // Ngày sinh
    bio: "An avid reader and tech enthusiast.", // Tiểu sử
    phone: "+1234567892" // Số điện thoại
  },
  {
    id: "4",
    name: "Emily Davis",
    ava: "/assets/ava/48.jpg",
    background: "",
    image: photo,
    mutualFriend: 3,
    mutualGroup: 1,
    status: "invite",
    birth: new Date("11/30/1995"), // Ngày sinh
    bio: "Loves art and painting.", // Tiểu sử
    phone: "+1234567893" // Số điện thoại
  },
  {
    id: "5",
    name: "Michael Brown",
    ava: "/assets/ava/ava2.jpg",
    background: "",
    image: photo,
    mutualFriend: 7,
    mutualGroup: 1,
    status: "suggest",
    birth: new Date("01/05/1991"), // Ngày sinh
    bio: "A fitness enthusiast and coach.", // Tiểu sử
    phone: "+1234567894" // Số điện thoại
  },
  {
    id: "6",
    name: "Sarah Wilson",
    ava: "/assets/ava/ava3.jpg",
    background: "",
    image: photo,
    mutualFriend: 4,
    mutualGroup: 6,
    status: "invite",
    birth: new Date("09/15/1994"), // Ngày sinh
    bio: "Enjoys cooking and trying new recipes.", // Tiểu sử
    phone: "+1234567895" // Số điện thoại
  },
  {
    id: "7",
    name: "David Martinez",
    ava: "/assets/ava/ava1.jpg",
    background: "",
    image: photo,
    mutualFriend: 9,
    mutualGroup: 6,
    status: "suggest",
    birth: new Date("08/25/1993"), // Ngày sinh
    bio: "Loves sports and outdoor activities.", // Tiểu sử
    phone: "+1234567896" // Số điện thoại
  },
  {
    id: "8",
    name: "Sophia Garcia",
    ava: "/assets/ava/ava2.jpg",
    background: "",
    image: photo,
    mutualFriend: 6,
    mutualGroup: 6,
    status: "invite",
    birth: new Date("03/12/1996"), // Ngày sinh
    bio: "Passionate about fashion and design.", // Tiểu sử
    phone: "+1234567897" // Số điện thoại
  },
  {
    id: "9",
    name: "James Anderson",
    ava: "/assets/ava/48.jpg",
    background: "",
    image: photo,
    mutualFriend: 2,
    mutualGroup: 2,
    status: "suggest",
    birth: new Date("07/19/1989"), // Ngày sinh
    bio: "A tech guru and video game lover.", // Tiểu sử
    phone: "+1234567898" // Số điện thoại
  },
  {
    id: "10",
    name: "Michael Brown",
    ava: "/assets/ava/ava1.jpg",
    background: "",
    image: photo,
    mutualFriend: 7,
    mutualGroup: 2,
    status: "suggest",
    birth: new Date("10/10/1992"), // Ngày sinh
    bio: "Music lover and guitarist.", // Tiểu sử
    phone: "+1234567899" // Số điện thoại
  },
  {
    id: "11",
    name: "Sarah Wilson",
    ava: "/assets/ava/48.jpg",
    background: "",
    image: photo,
    mutualFriend: 6,
    mutualGroup: 0,
    status: "invite",
    birth: new Date("05/30/1991"), // Ngày sinh
    bio: "Enjoys hiking and nature photography.", // Tiểu sử
    phone: "+1234567800" // Số điện thoại
  },
  {
    id: "12",
    name: "David Lee",
    ava: "/assets/ava/ava2.jpg",
    background: "",
    image: photo,
    mutualFriend: 12,
    mutualGroup: 2,
    status: "suggest",
    birth: new Date("12/12/1990"), // Ngày sinh
    bio: "Always up for a good laugh.", // Tiểu sử
    phone: "+1234567801" // Số điện thoại
  },
  {
    id: "13",
    name: "Anna White",
    ava: "/assets/ava/ava2.jpg",
    background: "",
    image: photo,
    mutualFriend: 5,
    mutualGroup: 1,
    status: "invite",
    birth: new Date("02/02/1995"), // Ngày sinh
    bio: "Loves reading and volunteering.", // Tiểu sử
    phone: "+1234567802" // Số điện thoại
  },
  {
    id: "14",
    name: "Chris Martin",
    ava: "/assets/ava/ava2.jpg",
    background: "",
    image: photo,
    mutualFriend: 9,
    mutualGroup: 3,
    status: "suggest",
    birth: new Date("06/17/1993"), // Ngày sinh
    bio: "A passionate traveler and writer.", // Tiểu sử
    phone: "+1234567803" // Số điện thoại
  },
  {
    id: "15",
    name: "Sophia Thomas",
    ava: "/assets/ava/ava3.jpg",
    background: "",
    image: photo,
    mutualFriend: 11,
    mutualGroup: 4,
    status: "invite",
    birth: new Date("08/09/1992"), // Ngày sinh
    bio: "Enjoys crafting and DIY projects.", // Tiểu sử
    phone: "+1234567804" // Số điện thoại
  },
  {
    id: "16",
    name: "Daniel Miller",
    ava: "/assets/ava/ava3.jpg",
    background: "",
    image: photo,
    mutualFriend: 4,
    mutualGroup: 2,
    status: "suggest",
    birth: new Date("11/04/1988"), // Ngày sinh
    bio: "Fitness lover and outdoor enthusiast.", // Tiểu sử
    phone: "+1234567805" // Số điện thoại
  },
  {
    id: "17",
    name: "Olivia Anderson",
    ava: "/assets/ava/ava1.jpg",
    background: "",
    image: photo,
    mutualFriend: 10,
    mutualGroup: 0,
    status: "invite",
    birth: new Date("07/15/1990"), // Ngày sinh
    bio: "Art and culture enthusiast.", // Tiểu sử
    phone: "+1234567806" // Số điện thoại
  },
  {
    id: "18",
    name: "Liam Harris",
    ava: "/assets/ava/48.jpg",
    background: "",
    image: photo,
    mutualFriend: 3,
    mutualGroup: 0,
    status: "suggest",
    birth: new Date("09/20/1991"), // Ngày sinh
    bio: "A curious mind always exploring.", // Tiểu sử
    phone: "+1234567807" // Số điện thoại
  },
  {
    id: "19",
    name: "Isabella Clark",
    ava: "/assets/ava/ava1.jpg",
    background: "",
    image: photo,
    mutualFriend: 8,
    mutualGroup: 2,
    status: "invite",
    birth: new Date("03/30/1995"), // Ngày sinh
    bio: "Loves to dance and sing.", // Tiểu sử
    phone: "+1234567808" // Số điện thoại
  },
  {
    id: "20",
    name: "James Martinez",
    ava: "/assets/ava/ava2.jpg",
    background: "",
    image: photo,
    mutualFriend: 7,
    mutualGroup: 2,
    status: "suggest",
    birth: new Date("12/01/1989"), // Ngày sinh
    bio: "A passionate cook and food blogger.", // Tiểu sử
    phone: "+1234567809" // Số điện thoại
  }
];

export const historyFindFriend: HistoryFindFriend[] = [
  {
    id: "1",
    name: "Ethan Le",
    ava: "/assets/ava/ava1.jpg",
    background: "",
    image: photo,
    mutualFriend: 6,
    mutualGroup: 1,
    status: "invite",
    birth: new Date("01/06/2004"),
    bio: "Hello",
    phone: "+1234567"
  },
  {
    id: "2",
    name: "Liam Nguyen",
    ava: "/assets/ava/ava2.jpg",
    background: "",
    image: photo,
    mutualFriend: 3,
    mutualGroup: 0,
    status: "nonfriend",
    birth: new Date("02/14/2003"), // Ngày sinh
    bio: "Love to explore new places!", // Tiểu sử
    phone: "+1234568" // Số điện thoại
  },
  {
    id: "3",
    name: "Sophia Tran",
    ava: "/assets/ava/ava3.jpg",
    background: "",
    image: photo,
    mutualFriend: 8,
    mutualGroup: 1,
    status: "friend",
    birth: new Date("05/22/2002"), // Ngày sinh
    bio: "Food lover and photographer.", // Tiểu sử
    phone: "+1234569" // Số điện thoại
  },
  {
    id: "4",
    name: "Lucas Pham",
    ava: "/assets/ava/48.jpg",
    background: "",
    image: photo,
    mutualFriend: 0,
    mutualGroup: 0,
    status: "invite",
    birth: new Date("07/30/2001"), // Ngày sinh
    bio: "Gamer and tech enthusiast.", // Tiểu sử
    phone: "+1234570" // Số điện thoại
  },
  {
    id: "5",
    name: "Mia Hoang",
    ava: "/assets/ava/ava2.jpg",
    background: "",
    image: photo,
    mutualFriend: 4,
    mutualGroup: 2,
    status: "friend",
    birth: new Date("11/11/2000"), // Ngày sinh
    bio: "Passionate about music and art.", // Tiểu sử
    phone: "+1234571" // Số điện thoại
  }
];
