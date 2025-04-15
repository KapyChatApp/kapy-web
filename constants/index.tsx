import { ConfirmModalProps } from "@/components/friends/ConfirmModal";
import { SidebarLink } from "@/types";

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
    route: "/group-chat",
    label: "Groups"
  },
  {
    icon: "ri:shake-hands-fill",
    route: "/friends",
    label: "Your friends"
  },
  {
    icon: "octicon:feed-tag-16",
    route: "/community",
    label: "New feeds"
  },
  {
    icon: "hugeicons:maps-global-01",
    route: "/map",
    label: "Your map"
  }
];

export const defaultConfirm: ConfirmModalProps = {
  setConfirm: () => {},
  handleAction: () => {},
  name: "",
  action: ""
};
