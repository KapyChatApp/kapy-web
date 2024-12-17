import { FileContent, ResponseMessageDTO } from "@/lib/DTO/message";
import { getFileFormat } from "@/lib/utils";
import axios from "axios";

export async function handleSendMultipleFiles(
  files: File[],
  boxId: string,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  if (!files.length || !boxId) {
    setError("No file to send");
    return;
  }
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    setError("No token found");
    return;
  }
  try {
    // Gửi từng file lên server
    for (const file of files) {
      const fileContent: FileContent = {
        fileName: file.name,
        url: "",
        publicId: "", // Cloudinary Public ID
        bytes: file.size.toString(),
        width: "0",
        height: "0",
        format: getFileFormat(file.type, file.name),
        type: file.type.split("/")[0]
      };

      const formData = new FormData();
      console.log(file);
      formData.append("boxId", boxId);
      formData.append("content", JSON.stringify(fileContent));
      formData.append("file", file);

      await axios.post(`${process.env.BASE_URL}message/send`, formData, {
        headers: {
          Authorization: storedToken,
          "Content-Type": "multipart/form-data"
        }
      });
    }
  } catch (error: any) {
    setError(error.message);
    console.error("Error sending files:", error);
  }
}
