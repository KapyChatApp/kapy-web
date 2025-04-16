import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

const DetailListUser = ({
  setIsBack,
  list,
  label
}: {
  setIsBack: React.Dispatch<React.SetStateAction<boolean>>;
  list: ShortUserResponseDTO[];
  label: string;
}) => {
  return (
    <div className="modal-overlay">
      <div className="min-w-[376px] max-w-[376px] md:max-w-[400px] lg:w-[400px] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col">
        <div className="flex w-full justify-between px-4 pt-2 pb-4">
          <div className="flex w-full h-fit items-center justify-start">
            <p className="text-dark100_light900 paragraph-semibold mt-2 ">
              {label}
            </p>
          </div>
          <div className="w-6 h-6 cursor-pointer">
            <Icon
              icon="iconoir:cancel"
              width={24}
              height={24}
              className="text-dark100_light900 object-cover"
              onClick={() => {
                setIsBack(false);
              }}
            />
          </div>
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex flex-col h-[307px] w-full overflow-scroll scrollable">
          {list.map((item) => {
            return (
              <a className="flex w-fit h-fit" href={`/account/${item._id}`}>
                <div className="flex flex-row gap-3 items-center justify-start px-4 py-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden">
                    <Image
                      src={
                        item.avatar !== ""
                          ? item.avatar
                          : "/assets/ava/default.png"
                      }
                      alt=""
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="paragraph-15-regular text-dark100_light900">
                    {item.firstName} {item.lastName}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>
      </div>
    </div>
  );
};

export default DetailListUser;
