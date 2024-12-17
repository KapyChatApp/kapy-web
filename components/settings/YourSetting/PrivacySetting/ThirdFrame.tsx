import React from "react";
import BlockMessages from "./BlockMessages";
import {
  FindUserDTO,
  FriendResponseDTO,
  RequestedResponseDTO
} from "@/lib/DTO/friend";

interface ThirdFrameProps {
  userBlock: FriendResponseDTO[] | RequestedResponseDTO[] | FindUserDTO[];
  unBlock: boolean;
  setUnBlock: React.Dispatch<React.SetStateAction<boolean>>;
  setIndex: React.Dispatch<React.SetStateAction<string>>;
  isIndex: string;
}

const ThirdFrame = ({
  userBlock,
  unBlock,
  setUnBlock,
  setIndex,
  isIndex
}: ThirdFrameProps) => {
  return (
    <div className="flex flex-col background-light900_dark400 py-3 px-4 rounded-lg w-full h-[239px] gap-4 overflow-scroll scrollable">
      <div className="flex flex-row w-fit h-fit gap-1 items-center justify-end">
        <p className="text-dark100_light900 paragraph-medium">Block messages</p>
        <p className="text-dark100_light900 body-light">({userBlock.length})</p>
      </div>
      {userBlock
        .filter((bl) => bl._id !== isIndex)
        .map((item) => {
          return (
            <BlockMessages
              block={item}
              setUnBlock={setUnBlock}
              setIndex={setIndex}
              unBlock={unBlock}
            />
          );
        })}
    </div>
  );
};

export default ThirdFrame;
