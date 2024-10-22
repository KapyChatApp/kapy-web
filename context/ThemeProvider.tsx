"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState("");

  const handleThemeChange = (currentMode: string) => {
    if (currentMode === "dark") {
      // Nếu người dùng chọn "dark"
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else if (currentMode === "light") {
      // Nếu người dùng chọn "light"
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      // Nếu người dùng chọn "system"
      localStorage.removeItem("theme"); // Xóa cài đặt của người dùng để dùng system theme
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (isSystemDark) {
        document.documentElement.classList.add("dark");
        setMode("dark");
      } else {
        document.documentElement.classList.remove("dark");
        setMode("light");
      }
    }
  };

  useEffect(() => {
    // Kiểm tra theme trong localStorage khi lần đầu tiên ứng dụng load
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setMode(storedTheme);
      handleThemeChange(storedTheme);
    } else {
      // Nếu không có theme lưu trữ, sử dụng system theme
      handleThemeChange("system");
    }
  }, []);

  useEffect(() => {
    if (mode) {
      handleThemeChange(mode);
    }
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
