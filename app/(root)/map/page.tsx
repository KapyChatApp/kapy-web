"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapStatusResponseDTO } from "@/lib/DTO/map";
import { getMyBestFriendMapStatus } from "@/lib/data/map/getMapBff";

// Chỉ import mã của Leaflet khi đang chạy trên client
const MapComponent = dynamic(
  () => import("../../../components/map/LeafLetMap"),
  { ssr: false }
);

const Page = () => {
  const [mapBff, setMapBff] = useState<MapStatusResponseDTO[]>([]);
  useEffect(() => {
    const fetchMapBff = async () => {
      const result = await getMyBestFriendMapStatus();
      setMapBff(result);
    };

    fetchMapBff();
  }, []);

  const params = { mapBff };
  return (
    <div id="map">
      <h1 className="text-dark100_light900 paragraph-bold">My Leaflet Map</h1>
      <MapComponent params={params} />
    </div>
  );
};

export default Page;
