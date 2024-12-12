import { MessageBoxInfo } from "@/lib/DTO/message";
import { useState } from "react";

const useSearchMessageBox = (box: MessageBoxInfo[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBox = box.filter((item) => {
    // Kiểm tra xem item có phải là đối tượng hợp lệ và có otherName hay không
    let name = item.receiverInfo.firstName + item.receiverInfo.lastName;
    if (item.groupName !== "") {
      name = item.groupName;
    }
    if (item && typeof item === "object" && name) {
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Nếu item không hợp lệ, trả về false để loại bỏ khỏi filteredBox
    return false;
  });

  return { searchTerm, setSearchTerm, filteredBox };
};

export default useSearchMessageBox;
