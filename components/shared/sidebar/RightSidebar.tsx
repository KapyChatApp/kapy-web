import React, { useState } from "react";
import SidebarMess from "@/components/message/SidebarMess";
import { usePathname } from "next/navigation";
import SidebarGroup from "@/components/groups/SidebarGroup";
import Management from "@/components/groups/Management";

const RightSidebar = () => {
  const [isManagementVisible, setIsManagementVisible] = useState(false);
  // Hàm để chuyển sang Management
  const handleManageClick = () => {
    setIsManagementVisible(true);
  };

  // Hàm để quay lại SidebarGroup
  const handleBackClick = () => {
    setIsManagementVisible(false);
  };

  const pathname = usePathname();
  return (
    <div className="flex w-full background-light850_dark200 h-full">
      <div className="flex flex-col items-center justify-start w-full h-full">
        {pathname === "/" ? (
          <SidebarMess />
        ) : !isManagementVisible ? (
          <SidebarGroup onManageClick={handleManageClick} />
        ) : (
          <Management onBackClick={handleBackClick} />
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
