export async function checkRelation(stUser: string, ndUser: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}user/checkRelation?stUser=${stUser}&ndUser=${ndUser}`
    );
    if (!response.ok) {
      throw new Error("Error fetching relation");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch relation:", error);
    throw error;
  }
}
