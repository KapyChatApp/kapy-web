import React from "react";
import "./globals.css";
import { Lexend } from "next/font/google"
import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeProvider";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Kapy ChatApp",
  description: "Kapy ChatApp",
  icons: {
    icon: "/public/vercel.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lexend.variable}`}>
      <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
