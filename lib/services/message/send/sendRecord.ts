import { FileContent } from "@/lib/DTO/message";
import { getFileFormat } from "@/lib/utils";
import axios from "axios";

export async function handleSendRecorder(
  record: File,
  boxId: string,
  setFile: React.Dispatch<React.SetStateAction<File | null>>,
  setAudioUrl: React.Dispatch<React.SetStateAction<string>>,
  setRecord: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    setError("No token found");
    return;
  }

  try {
    const fileContent: FileContent = {
      fileName: record.name,
      url: "",
      publicId: "", // Cloudinary Public ID
      bytes: record.size.toString(),
      width: "0",
      height: "0",
      format: getFileFormat(record.type, record.name),
      type: record.type.split("/")[0]
    };

    const formData = new FormData();
    console.log(record);
    formData.append("boxId", boxId);
    formData.append("content", JSON.stringify(fileContent));
    formData.append("file", record);

    const response = await axios.post(
      `${process.env.BASE_URL}message/send`,
      formData,
      {
        headers: {
          Authorization: storedToken,
          "Content-Type": "multipart/form-data"
        }
      }
    );
    if (response.status === 200) {
      setFile(null);
      setAudioUrl("");
      setRecord(false);
    }
  } catch (error: any) {
    setError(error.message);
    console.error("Error sending files:", error);
  }
}
