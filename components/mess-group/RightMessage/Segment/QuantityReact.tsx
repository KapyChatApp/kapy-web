import { Button } from "@/components/ui/button";
import { useChatContext } from "@/context/ChatContext";
import { ResponseMessageDTO, UserInfoBox } from "@/lib/DTO/message";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useMemo } from "react";

const QuantityReact = ({
  params: { setShowQuantity, recieverInfo, isReact }
}: {
  params: {
    setShowQuantity: React.Dispatch<React.SetStateAction<boolean>>;
    recieverInfo: UserInfoBox[];
    isReact: string[];
  };
}) => {
  const handleBack = () => {
    setShowQuantity(false);
  };
  const isReactInfo = useMemo(() => {
    return recieverInfo.filter((user) => isReact.includes(user._id));
  }, [recieverInfo, isReact]);
  return (
    <div className="modal-overlay">
      <div className="min-w-[400px] max-w-[400px] md:max-w-[520px] lg:w-[520px] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col gap-4 pb-4">
        <div className="flex w-full justify-between px-4 pt-2">
          <p className="text-dark100_light900 paragraph-semibold mt-2">
            Detail Reation
          </p>
          <Button
            className="flex bg-transparent shadow-none p-0 border-none hover:bg-transparent h-full w-fit"
            onClick={handleBack}
          >
            <Icon
              icon="iconoir:cancel"
              width={24}
              height={24}
              className="text-dark100_light900"
            />
          </Button>
        </div>

        <div className="flex flex-col w-full h-full justify-center items-start gap-4 px-4">
          {isReactInfo.map((item) => (
            <div className="flex flex-row gap-3 items-center justify-start">
              <Image
                src={item.avatar ? item.avatar : "/assets/ava/default.png"}
                alt=""
                width={36}
                height={36}
                className="rounded-full"
              />
              <p className="paragraph-15-regular text-dark100_light900">
                {item.firstName + " " + item.lastName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuantityReact;
