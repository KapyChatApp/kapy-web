"use client";
import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const LeafletMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);

  useEffect(() => {
    setIsClient(true); // Đảm bảo mã chỉ chạy trên client

    return () => {
      // Xóa bản đồ khi component unmount
      mapInstanceRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!isClient || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapContainerRef.current!, {
      center: L.latLng(49.2125578, 16.62662018), // Vị trí ban đầu
      zoom: 20
    });

    const key = "ftVwmQtJphE9VzstsQqs";

    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution:
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
        crossOrigin: true
      }
    ).addTo(mapInstanceRef.current);

    // Lấy vị trí người dùng
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const userLatLng = L.latLng(lat, lng);
          setUserLocation(userLatLng);

          // Đặt trung tâm bản đồ vào vị trí của người dùng
          mapInstanceRef.current?.setView(userLatLng, 14);

          // Thêm marker tại vị trí người dùng
          L.marker(userLatLng)
            .addTo(mapInstanceRef.current!)
            .bindPopup("Bạn đang ở đây!")
            .openPopup();
        },
        (error) => {
          console.error("Không thể lấy vị trí người dùng", error);
        }
      );
    }
  }, [isClient]);

  if (!isClient) {
    return null; // Trả về null khi chưa ở client để tránh render trên server
  }

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: "100vh", // Chiếm toàn bộ chiều cao của viewport
        width: "100%" // Chiếm toàn bộ chiều rộng của trang
      }}
    ></div>
  );
};

export default LeafletMap;
