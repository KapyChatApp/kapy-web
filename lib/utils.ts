import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
