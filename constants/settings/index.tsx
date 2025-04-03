import {
  SelectionContent,
  SettingItemProps,
  SidebarSettingButton
} from "@/types/settings";

export const sidebarSettingButton: SidebarSettingButton[] = [
  {
    icon: "weui:setting-filled",
    label: "General setting",
    value: "general"
  },
  {
    icon: "mdi:account-security",
    label: "Account and security",
    value: "account-security"
  },
  {
    icon: "ic:round-privacy-tip",
    label: "Privacy",
    value: "privacy"
  },
  {
    icon: "solar:phone-calling-bold",
    label: "Calling",
    value: "call"
  },
  {
    icon: "solar:login-3-bold",
    label: "Logged in History",
    value: "history"
  }
];

export const settingItem: SettingItemProps[] = [
  {
    icon: "iconoir:sound-high-solid",
    title: "Notification sound",
    description:
      "Use audio notifications to hear about messages, incoming calls, video chats, and sounds in apps."
  },
  {
    icon: "mingcute:notification-off-fill",
    title: "Do not disturb",
    description: "Turn off notifications for a certain time."
  }
];

export const themeMode: SettingItemProps[] = [
  {
    icon: "mingcute:sun-fill",
    title: "Light",
    description: "light"
  },
  {
    icon: "tabler:moon-filled",
    title: "Dark",
    description: "dark"
  },
  {
    icon: "material-symbols:computer",
    title: "System",
    description: "system"
  }
];

export const disturbTime = [
  {
    id: "1",
    unit: "15 minutes"
  },
  {
    id: "2",
    unit: "30 minutes"
  },
  {
    id: "3",
    unit: "1 hour"
  },
  {
    id: "4",
    unit: "8 hours"
  },
  {
    id: "5",
    unit: "24 hours"
  },
  {
    id: "6",
    unit: "Until turning off"
  }
];

export const selectionObject: SelectionContent[] = [
  {
    label: "Everyone",
    value: "everyone"
  },
  {
    label: "Friends",
    value: "friends"
  }
];

export const selectionMicro: SelectionContent[] = [
  {
    label: "Default device",
    value: "default"
  },
  {
    label: "Headset",
    value: "headset"
  },
  {
    label: "Microphone array",
    value: "array"
  }
];

export const selectionSpeaker: SelectionContent[] = [
  {
    label: "Default device",
    value: "default"
  },
  {
    label: "Headset",
    value: "headset"
  },
  {
    label: "Speaker",
    value: "speaker"
  }
];

export const selectionCamera: SelectionContent[] = [
  {
    label: "Intergrated camera",
    value: "default"
  }
];
