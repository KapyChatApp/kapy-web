import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { deleteMapStatus } from "@/lib/services/map/deleteStatus";
import { editMapStatus } from "@/lib/services/map/editStatus";
import { MapStatusResponseDTO } from "@/lib/DTO/map";
import { createMapStatus } from "@/lib/services/map/createStatus";

interface updateStatusProps {
  isCreate: boolean;
  status: string;
  statusId: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setIsClick: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateStatusModel = ({
  isCreate,
  status,
  statusId,
  setStatus,
  setIsClick,
  setIsCreate
}: updateStatusProps) => {
  const handleBack = () => {
    setIsClick(false);
  };

  const handleDeleteStatus = async () => {
    try {
      const result = await deleteMapStatus();
      if (result) {
        console.log(result);
        setStatus("");
        setIsClick(false);
        toast({
          title: `Delete Status Successfully`,
          className:
            "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
        });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: `Error in delete status`,
        description: err instanceof Error ? err.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };

  const handleEditStatus = async () => {
    try {
      const data = {
        caption: status
      };
      const result: MapStatusResponseDTO = await editMapStatus(data, statusId);
      if (result) {
        console.log(result);
        setStatus(result.caption);
        setIsClick(false);
        toast({
          title: `Edit Status Successfully`,
          className:
            "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
        });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: `Error in editing status`,
        description: err instanceof Error ? err.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };

  const handleCreateStatus = async () => {
    try {
      const data = {
        caption: status
      };
      const result: MapStatusResponseDTO = await createMapStatus(data);
      if (result) {
        setStatus(result.caption);
        setIsClick(false);
        setIsCreate(false);
        toast({
          title: `Create Status Successfully`,
          className:
            "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
        });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: `Error in create status`,
        description: err instanceof Error ? err.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };

  return (
    <div className="modal-overlay-map">
      <div className="min-w-[376px] max-w-[376px] md:max-w-[400px] lg:w-[400px] h-fit rounded-lg background-light900_dark200 items-center justify-start flex flex-col">
        <div className="flex w-full justify-between px-4 pt-2 pb-4">
          <p className="text-dark100_light900 paragraph-semibold mt-2">
            {isCreate ? "Create your status" : "Edit your status"}
          </p>
          <Icon
            icon="iconoir:cancel"
            width={24}
            height={24}
            className="text-dark100_light900 cursor-pointer"
            onClick={handleBack}
          />
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex flex-col h-[120px] w-full overflow-scroll scrollable p-4 gap-8">
          <div className="flex flex-col gap-3 w-full h-fit">
            <p className="text-dark100_light900 body-regular">Your Status</p>
            <Input
              type="text"
              placeholder={status}
              onChange={(e) => setStatus(e.target.value)}
              className="paragraph-regular text-dark100_light900 placeholder:opacity-50 placeholder:dark:opacity-80 no-focus bg-transparent border border-light-500 dark:border-dark-500 shadow-none outline-none w-full h-full placeholder:paragraph-regular rounded-lg p-2"
            ></Input>
          </div>
        </div>

        <span className="flex w-full h-[0.5px] background-light500_dark400"></span>

        <div className="flex justify-end w-full items-center pr-4 py-2">
          {isCreate ? (
            <div className="flex flex-row w-full h-fit gap-6 justify-end">
              <Button
                className="bg-primary-500 hover:bg-primary-500 text-light-900 paragraph-regular py-2 px-3 rounded-lg w-fit"
                onClick={handleCreateStatus}
              >
                Create
              </Button>
            </div>
          ) : (
            <div className="flex flex-row w-full h-fit gap-6 justify-end">
              <Button
                onClick={handleDeleteStatus}
                className="paragraph-regular text-dark100_light900 py-2 px-3 rounded-lg background-light700_dark400 w-fit"
              >
                Delete
              </Button>
              <Button
                className="bg-primary-500 hover:bg-primary-500 hover:bg-opacity-20 bg-opacity-20 text-primary-500 paragraph-regular py-2 px-3 rounded-lg w-fit"
                onClick={handleEditStatus}
              >
                Update
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModel;
