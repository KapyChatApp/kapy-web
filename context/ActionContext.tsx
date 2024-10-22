// contexts/ActionButtonContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ActionButtonContextProps {
  isNotified: boolean;
  isFind: boolean;
  isBest: boolean;
  isBlock: boolean;
  isAdd: boolean;
  isManage: boolean;
  setIsNotified: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFind: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBest: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBlock: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
  setIsManage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtonContext = createContext<ActionButtonContextProps | undefined>(
  undefined
);

export const ActionButtonProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [isNotified, setIsNotified] = useState(false);
  const [isFind, setIsFind] = useState(false);
  const [isBest, setIsBest] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isManage, setIsManage] = useState(false);

  return (
    <ActionButtonContext.Provider
      value={{
        isNotified,
        isFind,
        isBest,
        isBlock,
        isAdd,
        isManage,
        setIsNotified,
        setIsFind,
        setIsBest,
        setIsBlock,
        setIsAdd,
        setIsManage
      }}
    >
      {children}
    </ActionButtonContext.Provider>
  );
};

export const useActionButtonContext = () => {
  const context = useContext(ActionButtonContext);
  if (!context) {
    throw new Error(
      "useActionButtonContext must be used within an ActionButtonProvider"
    );
  }
  return context;
};
