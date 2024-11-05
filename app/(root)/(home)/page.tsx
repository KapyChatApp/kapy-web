"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const id = 1;
  redirect(`/${id}`);

  return null;
}
