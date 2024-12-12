import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isValid } from "date-fns";
import { admin } from "@/constants/object";
import { UserInfo } from "os";
import { ResponseMessageDTO, UserInfoBox } from "./DTO/message";

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
      const info = recievers.find((obj) => obj.id === message.createBy);
      box.senderName = info ? info.firstName + " " + info.lastName + ":" : "";
    } else box.senderName = "";
  }

  const now = new Date();
  const sendDate = new Date(message.createAt);
  const timeDifference = now.getTime() - sendDate.getTime();
  if (timeDifference < 60000) {
    box.createAt = "1min";
  } else {
    box.createAt = formatTimeMessageBox(message.createAt); // Lưu thời gian gốc nếu khác 1 phút
  }

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
