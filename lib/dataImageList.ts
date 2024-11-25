import axios from "axios";
import { FileContent } from "./dataMessages";

export const getImageList = async (boxId: string): Promise<string[]> => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) throw new Error("Authentication token not found");

  try {
    const response = await axios.get(
      `${process.env.BASE_URL}message/get-list/images?boxId=${boxId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );
    const apiData: FileContent = response.data;
    if (apiData && Array.isArray(apiData)) {
      const imageList = apiData.map((item) => item.url);
      return imageList;
    } else {
      throw new Error("Invalid data format");
    }
  } catch (error: any) {
    console.error("Error get image list:", error);
    throw new Error("Failed to get image list");
  }
};
