import { Button } from "@/components/ui/button";
import { FileSegment } from "@/components/ui/file-segment";
import { FileContent } from "@/lib/DTO/message";
import { SeeAllProps } from "@/types/mess-group";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const SeeAllFile: React.FC<SeeAllProps> = ({
  setActiveComponent,
  setItemSent,
  itemSent
}) => {
  const [fileList, setFileList] = useState<FileContent[]>([]);
  useEffect(() => {
    setFileList(itemSent as FileContent[]);
  }, [itemSent]);
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
          ? fileList.map((item) => {
              return (
                <FileSegment
                  fileName={item.fileName}
                  url={item.url}
                  textClassName="text-dark100_light900"
                  iconClassName="text-dark100_light900"
                />
              );
            })
          : null}
      </div>
    </div>
  );
};

export default SeeAllFile;
