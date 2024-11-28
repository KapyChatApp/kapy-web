import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface FileSegmentProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  fileName: string; // Tên file hiển thị
  url: string; // Đường dẫn để tải file
}

const FileSegment: React.FC<FileSegmentProps> = ({
  fileName,
  url,
  className,
  ...props
}) => {
  // Xử lý icon mặc định theo type nếu không truyền iconName
  const type = fileName.split(".").pop()?.toLowerCase() || "";
  const getDefaultIcon = (type: string) => {
    switch (type) {
      case "docx":
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

  const icon = getDefaultIcon(type);

  return (
    <div className={cn("flex items-center gap-2 p-1", className)}>
      {/* Hiển thị icon */}
      <Icon
        icon={icon}
        width={24}
        height={24}
        className="text-dark300_light800 md:w-6 md:h-6 w-5 h-5"
      />
      {/* Hiển thị tên file */}
      <Link
        href={url}
        download={fileName}
        className="text-dark300_light800 flex-wrap md:text-[14px] text-[13px] font-semibold hover:underline"
      >
        {fileName}
      </Link>
    </div>
  );
};

export { FileSegment };
