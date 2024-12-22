import axios from "axios";
import { CreateReportDTO } from "../DTO/report";

export async function createReport(param: CreateReportDTO) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("No token found");
      return;
    }

    const response = await axios.post(
      process.env.BASE_URL + "report/create",
      param,
      {
        headers: {
          Authorization: `${storedToken}`
        }
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error sending message: ", error);
  }
}
