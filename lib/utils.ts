import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

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
export const formatTimeMessageBox = (time: Date | string) => {
  const date = new Date(time);
  const now = new Date();
  const currentYear = now.getFullYear(); // Lấy năm hiện tại

  // Tính khoảng thời gian giữa hiện tại và thời gian được tạo
  const timeDifference = now.getTime() - date.getTime();
  const hoursDiff = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDiff = Math.floor(hoursDiff / 24);

  // Định dạng theo yêu cầu
  if (hoursDiff < 1) {
    const minutesDiff = Math.floor(timeDifference / (1000 * 60));
    return `${minutesDiff}min`; // Ví dụ: 1p, 2p,...
  } else if (hoursDiff < 24) {
    return `${hoursDiff}h`; // Ví dụ: 2h, 3h
  } else if (isToday(date)) {
    return format(date, "HH:mm"); // Ví dụ: 12:00 hoặc 00:01
  } else if (isYesterday(date)) {
    return `Yesterday`; // Ví dụ: Hôm qua 12:00
  } else {
    // Kiểm tra năm hiện tại
    if (date.getFullYear() === currentYear) {
      return format(date, "dd/MM"); // Ví dụ: 12/02
    } else {
      return format(date, "dd/MM/yyyy"); // Ví dụ: 12/02/2021
    }
  }
};
