import { SidebarLink } from "@/types";
import { SegmentGroupProps, SegmentMessProps } from "@/types/mess-group";
import { Group, User } from "@/types/object";

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
