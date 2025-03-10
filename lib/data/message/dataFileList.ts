import { FileContent } from "@/lib/DTO/message";
import axios from "axios";

export const getFileList = async (boxId: string): Promise<FileContent[]> => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) throw new Error("Authentication token not found");

  try {
    const response = await axios.get(
      `${process.env.BASE_URL}message/files?boxId=${boxId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );
    const apiData: FileContent[] = response.data;

    if (apiData && Array.isArray(apiData)) {
      const imageList = apiData;
      return imageList;
    } else {
      throw new Error("Invalid data format");
    }
  } catch (error: any) {
    console.error("Error get image list:", error);
    throw new Error("Failed to get image list");
  }
};
