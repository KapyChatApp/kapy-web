import React from "react";

const QuantityReact = ({
  params: { setShowQuantity }
}: {
  params: { setShowQuantity: React.Dispatch<React.SetStateAction<boolean>> };
}) => {
  const handleBack = () => {
    setShowQuantity(false);
  };
  return <div></div>;
};

export default QuantityReact;
