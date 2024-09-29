import { redirect } from "next/navigation";

export default function Page() {
  const id = "1";
  redirect(`/${id}`);

  return null;
}
