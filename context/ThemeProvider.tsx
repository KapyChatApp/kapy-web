"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState("");

  const handleThemeChange = () => {
    if (mode === "dark") {
      // Nếu người dùng chọn "dark"
      localStorage.theme = "dark";
      setMode("dark");
      document.documentElement.classList.add("dark");
    } else if (mode === "light") {
      // Nếu người dùng chọn "light"
      localStorage.theme = "light";
      setMode("light");
      document.documentElement.classList.remove("dark");
    } else {
      // Nếu người dùng chọn "system"
      localStorage.removeItem("theme"); // Xóa cài đặt của người dùng để dùng system theme
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (isSystemDark) {
        setMode("dark");
        document.documentElement.classList.add("dark");
      } else {
        setMode("light");
        document.documentElement.classList.remove("dark");
      }
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, [mode]);

  console.log("MODE: ", mode);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemProvider");
  }

  return context;
}
