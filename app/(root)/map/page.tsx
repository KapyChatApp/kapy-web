import React, { useEffect } from "react";
import dynamic from "next/dynamic";

// Chỉ import mã của Leaflet khi đang chạy trên client
const MapComponent = dynamic(
  () => import("../../../components/map/LeafLetMap"),
  { ssr: false }
);

const Page = () => {
  return (
    <div>
      <h1>My Leaflet Map</h1>
      <MapComponent />
    </div>
  );
};

export default Page;
