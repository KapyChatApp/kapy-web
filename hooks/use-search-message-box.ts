import { MessageBoxContent } from "@/lib/dataBox";
import { useState } from "react";

const useSearchMessageBox = (box: MessageBoxContent[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBox = box.filter((item) => {
    // Kiểm tra xem item có phải là đối tượng hợp lệ và có otherName hay không
    if (item && typeof item === "object" && item.receiverInfo.name) {
      return item.receiverInfo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
    // Nếu item không hợp lệ, trả về false để loại bỏ khỏi filteredBox
    return false;
  });

  return { searchTerm, setSearchTerm, filteredBox };
};

export default useSearchMessageBox;
