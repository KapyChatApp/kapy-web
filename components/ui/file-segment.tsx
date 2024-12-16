import { Icon } from "@iconify/react";
import { cn, getDefaultIcon } from "@/lib/utils";
import Link from "next/link";
import { useRef } from "react";

export interface FileSegmentProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  fileName: string; // Tên file hiển thị
  url: string;
  iconClassName?: string; // Class cho Icon
  textClassName?: string;
}

const FileSegment: React.FC<FileSegmentProps> = ({
  fileName,
  url,
  className,
  iconClassName,
  textClassName,
  ...props
}) => {
  // Xử lý icon mặc định theo type nếu không truyền iconName
  const type = fileName.split(".").pop()?.toLowerCase() || "";

  const icon = getDefaultIcon(type);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    fetch(url)
      .then((resp) => resp.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  return (
    <div className={cn("flex items-center gap-2 p-1", className)}>
      {/* Hiển thị icon */}
      <Icon
        icon={icon}
        width={24}
        height={24}
        className={cn(
          "text-dark300_light800 md:w-6 md:h-6 w-5 h-5",
          iconClassName
        )}
      />
      {/* Hiển thị tên file */}
      <div
        onClick={handleDownload}
        className={cn(" flex flex-wrap cursor-pointer", textClassName)}
      >
        <p className="text-dark300_light800  md:text-[14px] text-[12px] font-semibold text-decoration-none hover:text-decoration-none hover:no-underline">
          {fileName}
        </p>
      </div>
    </div>
  );
};

export { FileSegment };
