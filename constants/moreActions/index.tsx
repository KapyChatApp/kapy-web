import { Actions } from "@/types/mess-group";

export const actionsButton: Actions[] = [
  {
    icon: "clarity:notification-solid",
    label: "Turn off",
    click: "notified"
  },
  {
    icon: "ic:baseline-search",
    label: "Find",
    click: "find"
  },
  {
    icon: "ri:shake-hands-fill",
    label: "Best friend",
    click: "best"
  },
  {
    icon: "solar:user-block-bold",
    label: "Block",
    click: "block"
  },
  {
    icon: "weui:add-friends-filled",
    label: "Add mems",
    click: "add"
  },
  {
    icon: "lets-icons:setting-fill",
    label: "Manage",
    click: "manage"
  }
];
