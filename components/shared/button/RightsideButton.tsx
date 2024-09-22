import { Button } from "@/components/ui/button";
import { SidebarButton } from "@/types";
import { Icon } from "@iconify/react/dist/iconify.js";

const RightsideButton = ({
  icon,
  label,
  onClick,
  isBest,
  isBlock
}: SidebarButton & { isBest: boolean; isBlock: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center min-w-[60px] gap-[8px]">
      <Button
        className="flex items-center justify-center w-fit shadow-none hover:shadow-none focus:shadow-none outline-none border-none p-0"
        onClick={onClick}
      >
        <div
          className={`flex flex-col items-center justify-center rounded-full p-[6px] ${
            isBest
              ? "bg-primary-500 bg-opacity-20"
              : isBlock
              ? "bg-accent-red bg-opacity-20"
              : "bg-light-700 dark:bg-dark-400 dar:bg-opacity-80"
          }`}
        >
          <Icon
            icon={icon}
            width={24}
            height={24}
            className={`${
              isBest
                ? "text-primary-500"
                : isBlock
                ? "text-accent-red"
                : "text-dark100_light900"
            }`}
          />
        </div>
      </Button>
      <p
        className={`${
          isBest
            ? "text-primary-500 small-regular"
            : isBlock
            ? "text-accent-red small-regular"
            : "text-dark100_light900 small-regular"
        }`}
      >
        {label}
      </p>
    </div>
  );
};

export default RightsideButton;
