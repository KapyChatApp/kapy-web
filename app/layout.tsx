import React from "react";
import "./globals.css";
import { Lexend } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { ChatProvider } from "@/context/ChatContext";
import { UserProvider } from "@/context/UserContext";
import { FriendProvider } from "@/context/FriendContext";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LayoutProvider } from "@/context/LayoutContext";
import SocketProvider from "@/providers/SocketProvider";
import { cn } from "@/lib/utils";
import { GroupCallContextProvider } from "@/context/GroupCallContext";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend"
});

export const metadata: Metadata = {
  title: "Kapy ChatApp",
  description: "Kapy ChatApp",
  icons: {
    icon: "/assets/images/icon.png"
  }
};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Chewy&family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body
        cz-shortcut-listen="true"
        className={cn(
          lexend.className,
          "relative font-helvetica custom-scrollbar "
        )}
      >
        <LayoutProvider>
          <ThemeProvider>
            <UserProvider>
              {" "}
              {/* Bọc ngoài để SocketProvider có thể truy cập useUserContext */}
              <ChatProvider>
                <FriendProvider>
                  <SocketProvider>
                    {/* SocketProvider bây giờ có thể dùng useUserContext */}
                    <GroupCallContextProvider>
                      {" "}
                      {children}
                    </GroupCallContextProvider>
                  </SocketProvider>
                </FriendProvider>
              </ChatProvider>
            </UserProvider>
          </ThemeProvider>
        </LayoutProvider>

        <Toaster />
      </body>
    </html>
  );
}
