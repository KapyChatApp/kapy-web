import axios from "axios";

export async function fetchAuthHistory() {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }

    const response = await axios.get(
      `${process.env.BASE_URL}mine/auth-history`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}` // Gửi token để xác thực
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch auth history:");
    throw error;
  }
}
