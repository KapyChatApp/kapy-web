import axios from "axios";

export async function sendOTP(phoneNumber: string): Promise<boolean> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      return false;
    }

    const response = await axios.post(
      `${process.env.BASE_URL}authe/send-otp`,
      { phoneNumber: phoneNumber },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );
    const apiResponse = response.data;
    if (!apiResponse.success) {
      throw new Error(`Server error: ${apiResponse.messages}`);
    }

    return apiResponse;
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
}
