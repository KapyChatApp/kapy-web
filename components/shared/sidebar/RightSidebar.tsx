import React from "react";
import SidebarMess from "@/components/message/SidebarMess";
import { usePathname } from "next/navigation";
import SidebarGroup from "@/components/groups/SidebarGroup";

const RightSidebar = () => {
  const pathname = usePathname();
  return (
    <div className="flex w-full background-light850_dark200 h-full">
      <div className="flex flex-col p-[16px] items-center justify-start w-full h-full">
        {pathname === "/" ? <SidebarMess /> : <SidebarGroup />}
      </div>
    </div>
  );
};

export default RightSidebar;
