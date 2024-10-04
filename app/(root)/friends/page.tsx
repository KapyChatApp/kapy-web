import { redirect } from "next/navigation";

export default function Page() {
  const label = "all-friend";
  redirect(`/friends/${label}`);

  return null;
}
