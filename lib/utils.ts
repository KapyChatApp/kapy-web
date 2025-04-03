import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isValid } from "date-fns";
import { UserInfo } from "os";
import {
  MessageBoxInfo,
  RequestCreateGroup,
  ResponseMessageDTO,
  UserInfoBox
} from "./DTO/message";
import { ConfirmModalProps } from "@/components/friends/ConfirmModal";
import {
  FindUserDTO,
  FriendProfileResponseDTO,
  FriendRequestDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "./DTO/friend";
import { unFriend } from "./services/friend/unfriend";
import { unBestFriend } from "./services/friend/unBff";
import { addFriendRequest } from "./services/friend/addFriend";
import { addBestFriendRequest } from "./services/friend/addBff";
import { acceptFriend } from "./services/friend/acceptFriend";
import { acceptBestFriend } from "./services/friend/accepBff";
import { toast } from "@/hooks/use-toast";
import { blockFriend } from "./services/friend/block";
import { useUserContext } from "@/context/UserContext";
import { UserResponseDTO } from "./DTO/user";
import { useRouter } from "next/navigation";
import { createGroup } from "./services/message/createGroup";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date | string): string => {
  const now = new Date();

  // Chuyển đổi chuỗi thành Date nếu cần
  const createdDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  // Kiểm tra xem createdDate có hợp lệ không
  if (isNaN(createdDate.getTime())) {
    return "Invalid date";
  }

  const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1
      ? `${interval} minute ago`
      : `${interval} minutes ago`;
  }

  return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
};

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Nếu dateString không phải là một chuỗi ngày hợp lệ
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", options);
}

export function formatTime(dateString: Date): string {
  const date = new Date(dateString);
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  };

  // Kiểm tra ngày
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() ===
    date.toDateString();

  const isSameYear = date.getFullYear() === now.getFullYear(); // Kiểm tra năm

  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], options)}`;
  } else if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString([], options)}`;
  } else {
    // Nếu năm không giống nhau, hiển thị năm
    const dateStringFormat = isSameYear
      ? date.toLocaleDateString(undefined, { month: "long", day: "numeric" }) // Không hiển thị năm
      : date.toLocaleDateString(); // Hiển thị năm

    return `${dateStringFormat}, ${date.toLocaleTimeString([], options)}`;
  }
}

// Hàm định dạng thời gian
const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Hàm kiểm tra nếu thời gian là ngày hôm qua
const isYesterday = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

export const formatTimeMessageBox = (time: Date | string) => {
  if (!time) {
    throw new RangeError("Invalid time value: time is undefined or null");
  }
  const date = new Date(time);
  if (!isValid(date)) {
    throw new RangeError("Invalid time value");
  }
  const now = new Date();
  const currentYear = now.getFullYear(); // Lấy năm hiện tại

  // Tính khoảng thời gian giữa hiện tại và thời gian được tạo
  const timeDifference = now.getTime() - date.getTime();
  const secondsDiff = Math.floor(timeDifference / 1000); // Giây
  const minutesDiff = Math.floor(secondsDiff / 60); // Phút
  const hoursDiff = Math.floor(minutesDiff / 60); // Giờ
  const daysDiff = Math.floor(hoursDiff / 24); // Ngày

  // Định dạng theo yêu cầu
  if (secondsDiff < 60) {
    return `${secondsDiff}s`; // Ví dụ: 30s
  } else if (minutesDiff < 60) {
    return `${minutesDiff}mins`; // Ví dụ: 2mins
  } else if (hoursDiff < 24) {
    return `${hoursDiff}h`; // Ví dụ: 2h
  } else if (isYesterday(date)) {
    return `Yesterday`; // Ví dụ: Hôm qua
  } else if (isToday(date)) {
    return format(date, "HH:mm"); // Ví dụ: 12:00 hoặc 00:01
  } else {
    // Kiểm tra năm hiện tại
    if (date.getFullYear() === currentYear) {
      return format(date, "dd/MM"); // Ví dụ: 12/02
    } else {
      return format(date, "dd/MM/yyyy"); // Ví dụ: 12/02/2021
    }
  }
};

export const isCurrentPageBoxId = (boxId: string) => {
  if (typeof window === "undefined") return false;
  const currentPath = window.location.pathname;
  const currentId = currentPath.split("/").pop();
  return currentId === boxId;
};

export const getFileFormat = (mimeType: string, fileName: string): string => {
  // Lấy định dạng từ MIME type
  const inferredFormat = mimeType.split("/")[1]; // Lấy phần sau dấu "/"

  // Kiểm tra nếu định dạng từ MIME type là hợp lệ
  if (inferredFormat && /^[a-zA-Z0-9]+$/.test(inferredFormat)) {
    return inferredFormat; // Nếu hợp lệ, trả về định dạng
  }

  // Fallback: Lấy đuôi file từ fileName
  const fileExtension = fileName.split(".").pop();
  if (fileExtension && /^[a-zA-Z0-9]+$/.test(fileExtension)) {
    return fileExtension; // Nếu đuôi file hợp lệ, trả về đuôi file
  }

  // Trả về "unknown" nếu không xác định được
  return "unknown";
};

export const contentBox = (
  message: ResponseMessageDTO,
  adminId: string,
  recievers?: UserInfoBox[]
) => {
  let box = {
    content: "",
    senderName: "",
    createAt: ""
  };
  if (message.flag) {
    if (message.contentId) {
      const type = message.contentId.type;
      switch (type) {
        case "Image":
          box.content = "Sent a photo";
          break;
        case "Video":
          box.content = "Sent a video";
          break;
        case "Audio":
          box.content = "Sent an audio";
          break;
        default:
          box.content = "Sent a file";
          break;
      }
    } else if (message.text) {
      box.content = message.text;
    }
  } else {
    box.content = "Message revoked";
  }

  if (message.createBy === adminId) {
    box.senderName = "You:";
  } else {
    if (recievers) {
      const info = recievers.find((obj) => obj._id === message.createBy);
      box.senderName = info ? info.firstName + " " + info.lastName + ":" : "";
    } else box.senderName = "";
  }

  box.createAt = message.createAt;

  return box;
};

export const getDefaultIcon = (type: string) => {
  switch (type) {
    case "docx":
      return "mdi:file-word";
    case "doc":
      return "mdi:file-word";
    case "pptx":
      return "mdi:file-powerpoint";
    case "xlsx":
      return "mdi:file-excel";
    case "pdf":
      return "bxs:file-pdf";
    default:
      return "basil:document-solid"; // Icon mặc định
  }
};

export const handleMessage = async (
  param: RequestCreateGroup,
  groupAva: File | undefined,
  setDataChat: React.Dispatch<React.SetStateAction<MessageBoxInfo[]>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  router: ReturnType<typeof useRouter>
) => {
  const result = await createGroup(param, groupAva, setDataChat, setError);
  const { success, messageBox } = result;
  if (success) {
    router.push(`/${messageBox._id}`);
  } else {
    toast({
      title: "You can't create message box. Try again please!",
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
};

export const confirmHandleUnfr = (
  setIsConfirm: React.Dispatch<React.SetStateAction<boolean>>,
  setConfirm: React.Dispatch<React.SetStateAction<ConfirmModalProps>>,
  user:
    | FriendProfileResponseDTO
    | RequestedResponseDTO
    | FindUserDTO
    | FriendResponseDTO,
  param: FriendRequestDTO,
  setListFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>,
  setRelation?: React.Dispatch<React.SetStateAction<string>>
) => {
  console.log("Called confirmHandleUnfr");
  setIsConfirm(true);
  console.log("isConfirm set to true");

  const confirm: ConfirmModalProps = {
    setConfirm: setIsConfirm,
    handleAction: () => handleUnfr(param, setListFriend, setRelation),
    name: user.firstName + " " + user.lastName,
    action: "unfriend"
  };
  setConfirm(confirm);
  console.log("Confirm modal data:", confirm);
};
export const confirmHandleUnBff = (
  setIsConfirm: React.Dispatch<React.SetStateAction<boolean>>,
  setConfirm: React.Dispatch<React.SetStateAction<ConfirmModalProps>>,
  user:
    | FriendProfileResponseDTO
    | RequestedResponseDTO
    | FindUserDTO
    | FriendResponseDTO,
  param: FriendRequestDTO,
  setListBestFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>,
  setRelation?: React.Dispatch<React.SetStateAction<string>>
) => {
  setIsConfirm(true);
  const confirm: ConfirmModalProps = {
    setConfirm: setIsConfirm,
    handleAction: () => handleUnBff(param, setListBestFriend, setRelation),
    name: user.firstName + " " + user.lastName,
    action: "unbff"
  };
  setConfirm(confirm);
};
export const confirmHandleBlock = (
  setIsConfirm: React.Dispatch<React.SetStateAction<boolean>>,
  setConfirm: React.Dispatch<React.SetStateAction<ConfirmModalProps>>,
  user:
    | FriendProfileResponseDTO
    | RequestedResponseDTO
    | FindUserDTO
    | FriendResponseDTO,
  param: FriendRequestDTO,
  setListFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>,
  setRelation?: React.Dispatch<React.SetStateAction<string>>
) => {
  setIsConfirm(true);
  const confirm: ConfirmModalProps = {
    setConfirm: setIsConfirm,
    handleAction: () => handleBlockFr(param, setListFriend, setRelation),
    name: user.firstName + " " + user.lastName,
    action: "block"
  };
  setConfirm(confirm);
};

export const handleUnfr = async (
  param: FriendRequestDTO,
  setListFriend?: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>,
  setRelation?: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    await unFriend(param, setListFriend);
    if (setRelation) {
      setRelation("");
    }
    toast({
      title: `Unfriend successfully`,
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
  } catch (error) {
    console.error("Error in handleUnfr:", error);
    toast({
      title: `Error in unfriend`,
      description: error instanceof Error ? error.message : "Unknown error",
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
};
export const handleUnBff = async (
  param: FriendRequestDTO,
  setListBestFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>,
  setRelation?: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    await unBestFriend(param, setListBestFriend);
    if (setRelation) {
      setRelation("friend");
    }
    toast({
      title: `UnBff successfully`,
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
  } catch (error) {
    console.error("Failed to unbest friend:", error);
    toast({
      title: `Error in unfriend`,
      description: error instanceof Error ? error.message : "Unknown error",
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
};
export const handleAddfr = async (
  param: FriendRequestDTO,
  setRelation?: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const response = await addFriendRequest(param);
    if (setRelation) {
      setRelation("sent_friend");
    }
    toast({
      title: `Add friend successfully`,
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
  } catch (error) {
    console.error("Failed to send friend request:", error);
    toast({
      title: `Error in unfriend`,
      description: error instanceof Error ? error.message : "Unknown error",
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
};
export const handleAddBff = async (
  param: FriendRequestDTO,
  setRelation: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const result = await addBestFriendRequest(param);
    setRelation("sent_bff");
    toast({
      title: `Add Bff successfully`,
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
  } catch (error) {
    console.error("Failed to add best friend:", error);
    toast({
      title: `Error in unfriend`,
      description: error instanceof Error ? error.message : "Unknown error",
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
};
export const handleAcceptFr = async (
  param: FriendRequestDTO,
  setListRequestedFriend: React.Dispatch<
    React.SetStateAction<RequestedResponseDTO[]>
  >,
  setRelation?: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    await acceptFriend(param, setListRequestedFriend);
    if (setRelation) {
      setRelation("friend");
    }
    toast({
      title: `Accept friend request successfully`,
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
  } catch (error) {
    console.error("Failed to accept friend request:", error);
    toast({
      title: `Error in unfriend`,
      description: error instanceof Error ? error.message : "Unknown error",
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
};
export const handleAcceptBff = async (
  param: FriendRequestDTO,
  setListRequestedFriend: React.Dispatch<
    React.SetStateAction<RequestedResponseDTO[]>
  >,
  setRelation?: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    await acceptBestFriend(param, setListRequestedFriend);
    if (setRelation) {
      setRelation("bff");
    }
    toast({
      title: `Accept best friend request successfully`,
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
  } catch (error) {
    console.error("Failed to accept best friend request:", error);
    toast({
      title: `Error in unfriend`,
      description: error instanceof Error ? error.message : "Unknown error",
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
};
export const handleBlockFr = async (
  param: FriendRequestDTO,
  setListFriend: React.Dispatch<React.SetStateAction<FriendResponseDTO[]>>,
  setRelation?: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    await blockFriend(param, setListFriend);
    toast({
      title: `Blocked successfully`,
      className:
        "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
    });
    if (setRelation) {
      setRelation("block");
    }
  } catch (error) {
    console.error("Failed to block friend", error);
    toast({
      title: `Error in blocking friend`,
      description: error instanceof Error ? error.message : "Unknown error",
      className:
        "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
    });
  }
};

export const deltaMapStatus = (latitude: number) => {
  const parseLatitude = parseFloat(latitude.toString());
  const EARTH_RADIUS = 6371000; // Bán kính Trái Đất tính bằng mét
  const OFFSET_METERS = 10; // Bán kính dịch chuyển tính bằng mét
  const deltaLatitude = (OFFSET_METERS / EARTH_RADIUS) * (180 / Math.PI);
  const deltaLongitude =
    (OFFSET_METERS /
      (EARTH_RADIUS * Math.cos((parseLatitude * Math.PI) / 180))) *
    (180 / Math.PI);

  return { deltaLatitude, deltaLongitude };
};

export const getDeviceInfo = () => {
  // Lấy thông tin trình duyệt từ user-agent (dùng window.navigator)
  const userAgent = window.navigator.userAgent;

  // Phân loại loại thiết bị
  let deviceType = "DESKTOP"; // Mặc định là DESKTOP
  if (/android/i.test(userAgent)) {
    deviceType = "PHONE"; // Android là điện thoại
  } else if (/iphone/i.test(userAgent)) {
    deviceType = "PHONE"; // iPhone là điện thoại
  } else if (/ipad|tablet/i.test(userAgent)) {
    deviceType = "TABLET"; // iPad hoặc thiết bị tablet
  } else if (/windows/i.test(userAgent) && /touch/i.test(userAgent)) {
    deviceType = "TABLET"; // Windows touch device có thể là tablet
  } else if (/macintosh/i.test(userAgent)) {
    deviceType = "DESKTOP"; // macOS thường là máy tính để bàn
  }

  // Lấy ngôn ngữ của trang (document.documentElement.lang) cho vùng
  const region = document.documentElement.lang || "Unknown";

  // Thông tin về hệ điều hành từ user-agent
  const osName = userAgent.includes("Windows")
    ? "Windows"
    : userAgent.includes("Mac OS X")
    ? "macOS"
    : userAgent.includes("Linux")
    ? "Linux"
    : "Unknown OS";

  // Thông tin trình duyệt (dựa trên user-agent)
  const browser = userAgent.includes("Chrome")
    ? "Chrome"
    : userAgent.includes("Firefox")
    ? "Firefox"
    : userAgent.includes("Safari")
    ? "Safari"
    : userAgent.includes("Edge")
    ? "Edge"
    : "Unknown Browser";

  // Phiên bản hệ điều hành và trình duyệt (dựa trên user-agent)
  const osMatch = userAgent.match(
    /(Windows NT|Mac OS X|Linux|Android|iOS) ([\d._]+)/
  );
  const osVersion = osMatch ? osMatch[2] : "Unknown Version";

  // Thông tin về trình duyệt từ window
  const brand = window.navigator.vendor || "Unknown Vendor"; // Nhà cung cấp trình duyệt
  const modelName = window.navigator.appName || "Unknown Browser"; // Tên trình duyệt

  // Tạo thông tin thiết bị trả về
  const deviceInfo = {
    deviceName: userAgent,
    deviceType: deviceType,
    brand: brand,
    modelName: modelName,
    osName: osName,
    osVersion: osVersion,
    region: region,
    isSafe: true
  };

  return deviceInfo;
};
