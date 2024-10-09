import { Button } from "@/components/ui/button";
import { Files } from "@/types/media";
import { SeeAllProps } from "@/types/mess-group";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SeeAllFile: React.FC<SeeAllProps> = ({
  setActiveComponent,
  setItemSent,
  itemSent
}) => {
  const fileList = itemSent as Files[];
  const handleBack = () => {
    setActiveComponent("");
  };
  return (
    <div className="flex flex-col items-center justify-start w-full h-fit gap-6">
      <div className="flex w-full bg-light-700 dark:bg-dark-400 dark:bg-opacity-80 rounded-[12px] justify-center items-center h-[80px]">
        <Button
          className="flex flex-row shadow-none border-none bg-transparent w-full items-center justify-start gap-3 py-[28px] h-auto"
          onClick={handleBack}
        >
          <Icon
            icon="formkit:arrowleft"
            width={28}
            height={28}
            className="text-dark100_light900"
          />
          <div className="flex justify-center items-end w-full">
            <p className="paragraph-semibold text-dark100_light900">
              Files of Group
            </p>
            <p className="text-dark100_light900 text-opacity-50 dark:text-opacity-80 paragraph-regular ml-1">
              ({fileList.length})
            </p>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-start w-full gap-5 px-2">
        {fileList.length > 0
          ? fileList.slice(0, 3).map((item) => {
              let icon = item.icon;
              let iconWord = "vscode-icons:file-type-word2";
              let iconExcel = "vscode-icons:file-type-excel2";
              let iconPpoint = "vscode-icons:file-type-powerpoint2";
              let iconPdf = "vscode-icons:file-type-pdf2";
              switch (item.type) {
                case "word":
                  icon = iconWord;
                  break;
                case "excel":
                  icon = iconExcel;
                  break;
                case "powerpoint":
                  icon = iconPpoint;
                  break;
                case "pdf":
                  icon = iconPdf;
                  break;
                default:
                  icon = "flat-color-icons:file";
              }
              return (
                <div className="flex flex-row relative gap-[12px] items-center justify-start">
                  <Icon icon={icon} width={30} height={30} className="" />
                  <Link
                    href={item.path}
                    className="flex flex-grow items-center justify-start text-dark100_light900 paragraph-regular "
                  >
                    {item.fileName}
                  </Link>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default SeeAllFile;
