import { UserUpdatePassRequest } from "@/lib/DTO/user";

export async function updateUserPassword(params: UserUpdatePassRequest) {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token is missing");
    }

    const response = await fetch(
      `${process.env.BASE_URL}user/update-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${storedToken}` // Thêm token nếu cần
        },
        body: JSON.stringify(params)
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update password:", error);
    throw error;
  }
}
