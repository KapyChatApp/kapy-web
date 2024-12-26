import axios from "axios";

export const deleteMapStatus = async () => {
  try {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.log("No token found");
      return;
    }
    const response = await axios.delete(
      `${process.env.BASE_URL}livemap/status/delete`,
      {
        headers: {
          Authorization: `${storedToken}` // Đính kèm token trong header
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error deleting map status:", error.response?.data || error);
    throw new Error(
      error.response?.data?.error || "Failed to delete map status"
    );
  }
};
