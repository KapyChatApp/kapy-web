import {
  Photo,
  SidebarLink,
  Video,
  File,
  Link,
  SidebarButton,
  MememberGroup
} from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "mingcute:sun-fill" },
  { value: "dark", label: "Dark", icon: "tabler:moon-filled" },
  { value: "system", label: "System", icon: "material-symbols:computer" }
];

export const sidebarLinks: SidebarLink[] = [
  {
    icon: "tabler:message-circle-filled",
    route: "/",
    label: "Message"
  },
  {
    icon: "mingcute:group-2-fill",
    route: "/groups",
    label: "Groups"
  },
  {
    icon: "ri:shake-hands-fill",
    route: "/friends",
    label: "Your friends"
  },
  {
    icon: "hugeicons:maps-global-01",
    route: "/map",
    label: "Your map"
  }
];

export const members: MememberGroup[] = [
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
    ava: "/assets/ava/ava1.jpg",
    addedBy: "MasterD",
    isOnline: false
  },
  {
    id: "5",
    username: "Hahaha",
    ava: "/assets/ava/ava1.jpg",
    addedBy: "MasterD",
    isOnline: true
  }
];

export const photo: Photo[] = [
  {
    id: "1",
    fileName: "photo1",
    path: "/assets/ava/ava1.jpg",
    size: 100,
    createAt: new Date("2024-09-20T10:00:00Z"),
    createBy: "Junnie"
  },
  {
    id: "2",
    fileName: "photo2",
    path: "/assets/ava/ava1.jpg",
    size: 150,
    createAt: new Date("2024-09-21T12:00:00Z"),
    createBy: "Alex"
  },
  {
    id: "3",
    fileName: "photo3",
    path: "/assets/ava/ava1.jpg",
    size: 200,
    createAt: new Date("2024-09-22T14:00:00Z"),
    createBy: "Marie"
  },
  {
    id: "4",
    fileName: "photo4",
    path: "/assets/ava/ava1.jpg",
    size: 250,
    createAt: new Date("2024-09-23T09:30:00Z"),
    createBy: "John"
  },
  {
    id: "5",
    fileName: "photo5",
    path: "/assets/ava/ava1.jpg",
    size: 300,
    createAt: new Date("2024-09-24T11:00:00Z"),
    createBy: "Sara"
  },
  {
    id: "6",
    fileName: "photo6",
    path: "/assets/ava/ava1.jpg",
    size: 350,
    createAt: new Date("2024-09-25T08:15:00Z"),
    createBy: "Emma"
  }
];

export const video: Video[] = [
  {
    id: "1",
    fileName: "video1",
    path: "/assets/ava/ava2.jpg",
    size: 100,
    createAt: new Date("2024-09-20T10:00:00Z"),
    createBy: "Junnie"
  },
  {
    id: "2",
    fileName: "video2",
    path: "/assets/ava/ava2.jpg",
    size: 150,
    createAt: new Date("2024-09-21T12:00:00Z"),
    createBy: "Alex"
  },
  {
    id: "3",
    fileName: "video3",
    path: "/assets/ava/ava2.jpg",
    size: 200,
    createAt: new Date("2024-09-22T14:00:00Z"),
    createBy: "Marie"
  },
  {
    id: "4",
    fileName: "video4",
    path: "/assets/ava/ava2.jpg",
    size: 250,
    createAt: new Date("2024-09-23T09:30:00Z"),
    createBy: "John"
  },
  {
    id: "5",
    fileName: "video5",
    path: "/assets/ava/ava2.jpg",
    size: 300,
    createAt: new Date("2024-09-24T11:00:00Z"),
    createBy: "Sara"
  },
  {
    id: "6",
    fileName: "video6",
    path: "/assets/ava/ava2.jpg",
    size: 350,
    createAt: new Date("2024-09-25T08:15:00Z"),
    createBy: "Emma"
  }
];

export const file: File[] = [
  {
    id: "1",
    fileName: "Document1",
    icon: "vscode-icons:file-type-word2",
    type: "word",
    path: "https://docs.google.com/document/d/1YwnhVRZznIleAaK-VHUJrFABeA_aTJHab1v776_Cxy0/edit",
    createAt: new Date("2024-09-20T10:00:00Z"),
    createBy: "Alice"
  },
  {
    id: "2",
    fileName: "Image1",
    icon: "vscode-icons:file-type-excel2",
    type: "excel",
    path: "https://docs.google.com/spreadsheets/d/1a83xkXwtlFMZWFDvvhXR7MPJrPB3dtUQyziWxmQNaSI/edit?gid=1887660063#gid=1887660063",
    createAt: new Date("2024-09-21T12:30:00Z"),
    createBy: "Bob"
  },
  {
    id: "3",
    fileName: "Presentation1",
    icon: "vscode-icons:file-type-powerpoint2",
    type: "powerpoint",
    path: "https://docs.google.com/document/d/1YwnhVRZznIleAaK-VHUJrFABeA_aTJHab1v776_Cxy0/edit",
    createAt: new Date("2024-09-22T14:45:00Z"),
    createBy: "Charlie"
  },
  {
    id: "4",
    fileName: "Pdf1",
    icon: "vscode-icons:file-type-pdf2",
    type: "pdf",
    path: "https://drive.google.com/drive/folders/1IdR9WtL07-JNiir5QhjqgtbFfxQdfTUv",
    createAt: new Date("2024-09-23T09:15:00Z"),
    createBy: "Dana"
  }
];

export const link: Link[] = [
  {
    id: "1",
    linkName: "Helllloooo1",
    icon: "logos:google-drive",
    type: "drive",
    path: "https://drive.google.com/drive/folders/1IdR9WtL07-JNiir5QhjqgtbFfxQdfTUv",
    createAt: new Date("2024-09-23T09:15:00Z"),
    createBy: "Dana"
  },
  {
    id: "2",
    linkName: "Helllloooo2",
    icon: "logos:google-drive",
    type: "drive",
    path: "https://drive.google.com/drive/folders/1IdR9WtL07-JNiir5QhjqgtbFfxQdfTUv",
    createAt: new Date("2024-09-23T09:15:00Z"),
    createBy: "Dana"
  },
  {
    id: "3",
    linkName: "Helllloooo3",
    icon: "logos:google-drive",
    type: "drive",
    path: "https://drive.google.com/drive/folders/1IdR9WtL07-JNiir5QhjqgtbFfxQdfTUv",
    createAt: new Date("2024-09-23T09:15:00Z"),
    createBy: "Dana"
  }
];

export const sidebarMess: SidebarButton[] = [
  {
    icon: "clarity:notification-solid",
    label: "Notification",
    onClick: handleNotificationClick
  },
  {
    icon: "ic:baseline-search",
    label: "Find",
    onClick: handleFindClick
  },
  {
    icon: "ri:shake-hands-fill",
    label: "Best friend",
    onClick: handleBestFriendClick
  },
  {
    icon: "solar:user-block-bold",
    label: "Block",
    onClick: handleBlockClick
  }
];

export const sidebarGroup: SidebarButton[] = [
  {
    icon: "clarity:notification-solid",
    label: "Notification",
    onClick: handleNotificationClick
  },
  {
    icon: "weui:add-friends-filled",
    label: "Add members",
    onClick: handleAddMembersClick
  },
  {
    icon: "ic:baseline-search",
    label: "Find",
    onClick: handleFindClick
  },
  {
    icon: "lets-icons:setting-fill",
    label: "Manage",
    onClick: handleOpenManageClick
  }
];

function handleNotificationClick(
  event: React.MouseEvent<HTMLButtonElement>
): void {
  // Logic cho sự kiện click "Best Friend"
  console.log("Notificate clicked!");
}

function handleBestFriendClick(
  event: React.MouseEvent<HTMLButtonElement>
): void {
  // Logic cho sự kiện click "Best Friend"
  console.log("Best friend clicked!");
}

function handleFindClick(event: React.MouseEvent<HTMLButtonElement>): void {
  // Logic cho sự kiện click "Find"
  console.log("Find clicked!");
}

function handleBlockClick(event: React.MouseEvent<HTMLButtonElement>): void {
  // Logic cho sự kiện click "Block"
  console.log("Block clicked!");
}

function handleAddMembersClick(
  event: React.MouseEvent<HTMLButtonElement>
): void {
  // Logic cho sự kiện click "Add Members"
  console.log("Add members clicked!");
}

function handleOpenManageClick(
  event: React.MouseEvent<HTMLButtonElement>
): void {
  // Logic cho sự kiện click "Open Manage"
  console.log("Open manage clicked!");
}
