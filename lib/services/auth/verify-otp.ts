import axios from "axios";

export async function verifyOTP(
  phoneNumber: string,
  otp: string
): Promise<boolean> {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
      return false;
    }

    const response = await axios.post(
      `${process.env.BASE_URL}authe/send-otp`,
      { phoneNumber: phoneNumber, otp: otp },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}`
        }
      }
    );
    const apiResponse = response.data;
    if (response.status !== 200) {
      throw new Error(`Server error: ${apiResponse.messages}`);
    }

    return apiResponse;
  } catch (error) {
    console.error("Error checking token:", error);
    return false; // Trả về kiểu phù hợp với kiểu đã khai báo
  }
}
