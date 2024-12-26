// contexts/LayoutContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextProps {
  isParagraphVisible: boolean;
  setIsParagraphVisible: React.Dispatch<React.SetStateAction<boolean>>;
  openMore: boolean;
  setOpenMore: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [isParagraphVisible, setIsParagraphVisible] = useState(true);
  const [openMore, setOpenMore] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        isParagraphVisible,
        setIsParagraphVisible,
        openMore,
        setOpenMore
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within an LayoutProvider");
  }
  return context;
};
