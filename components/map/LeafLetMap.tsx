"use client";
import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import UpdateStatusModel from "./UpdateStatusModel";
import { defaultValue, getMyMap } from "@/lib/services/map/getMineMap";
import { LocationDTO } from "@/lib/DTO/location";
import { toast } from "@/hooks/use-toast";
import { MapStatusResponseDTO } from "@/lib/DTO/map";
import { deltaMapStatus } from "@/lib/utils";

const LeafletMap = ({
  params: { mapBff }
}: {
  params: { mapBff: MapStatusResponseDTO[] };
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [status, setStatus] = useState("");
  const [statusId, setStatusId] = useState("");
  const [error, setError] = useState("");
  const markersData: Record<number, MapStatusResponseDTO> = {};

  useEffect(() => {
    setIsClient(true); // Đảm bảo mã chỉ chạy trên client

    return () => {
      // Xóa bản đồ khi component unmount
      mapInstanceRef.current?.remove();
    };
  }, []);
  const getAndInitiateMyMap = async (param: LocationDTO) => {
    const result: MapStatusResponseDTO = await getMyMap(param, setError);
    if (result) {
      setStatusId(result._id);
      if (result.caption) {
        setIsCreate(false);
        setStatus(result.caption);
      } else {
        setStatus("");
      }
      return result;
    }
    return defaultValue; // Trả về result nếu không phải undefined
  };
  const createPopupContent = (rawStatus: string) => {
    return `
      <div className="custom-popup p-1 rounded text-center gap-1 justify-center items-center">
        <p className="text-light-900 body-regular">You're here!</p>
        <p className="text-light-900 body-bold">${
          status
            ? status
            : rawStatus
            ? rawStatus
            : "Click the name to create status!"
        }</p>
      </div>
    `;
  };
  const createPopupBffContent = (rawStatus: string) => {
    return `
      <div className="bg-primary-200 p-1 rounded text-center gap-1 justify-center items-center">
        <p className="text-primary-500 body-bold">${
          rawStatus || "No status"
        }</p>
      </div>
    `;
  };
  const createCustomIcon = (avatar: string) => {
    return L.icon({
      iconUrl: `${avatar ? avatar : "/assets/ava/default.png"}`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -30],
      className: "custom-marker-icon"
    });
  };
  const createNameDiv = (name: string) => {
    const nameDiv = document.createElement("button");
    nameDiv.innerHTML = `${name}`;
    nameDiv.className =
      "update-status-btn bg-white text-primary-500 border-none py-1 px-3 rounded cursor-pointer mt-2 shadow-lg w-[120px] text-center body-semibold";

    return L.divIcon({
      className: "leaflet-status-button",
      html: nameDiv.outerHTML,
      iconSize: [200, 50],
      iconAnchor: [60, -20]
    });
  };
  const handleMapCreation = (
    result: MapStatusResponseDTO,
    userLatLng: L.LatLng
  ) => {
    // Tạo customIcon và marker cho người dùng
    const customIcon = createCustomIcon(result.createBy.avatar);
    const marker = L.marker(userLatLng, { icon: customIcon }).addTo(
      mapInstanceRef.current!
    );

    setTimeout(() => {
      // Tạo popup cho marker
      const popupContent = createPopupContent(result.caption);
      const popup = L.popup({
        className: "custom-leaflet-popup",
        autoClose: false,
        closeOnClick: false
      })
        .setLatLng(userLatLng)
        .setContent(popupContent);

      popup.openOn(mapInstanceRef.current!); // Mở popup trên bản đồ
      marker.bindPopup(popup).openPopup(); // Gắn popup vào marker
    }, 0);

    // Tạo nameDiv và nameMarker cho người dùng
    const nameDiv = createNameDiv(
      result.createBy.firstName + " " + result.createBy.lastName
    );
    const nameMarker = L.marker(userLatLng, { icon: nameDiv }).addTo(
      mapInstanceRef.current!
    );
    nameMarker.on("click", () => {
      setIsClick(true);
    });
  };

  const renderMap = async () => {
    if (!isClient || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapContainerRef.current!, {
      center: L.latLng(0, 0),
      zoom: 20
    });

    const key = "ftVwmQtJphE9VzstsQqs";
    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        maxZoom: 20,
        attribution:
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        crossOrigin: true
      }
    ).addTo(mapInstanceRef.current);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const userLatLng = L.latLng(lat, lng);
          setUserLocation(userLatLng);
          mapInstanceRef?.current?.setView(userLatLng, 18);
          const param: LocationDTO = {
            latitude: lat,
            longitude: lng,
            altitude: position.coords.altitude || 0,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy || 0,
            heading: position.coords.heading || 0,
            speed: position.coords.speed || 0
          };

          const result = await getAndInitiateMyMap(param);

          if (result) {
            handleMapCreation(result, userLatLng); // Gọi hàm tạo marker và popup sau khi có kết quả
          }
        },
        (error) => {
          setStatus("Can't find your location.");
          console.error("Error: ", error);
        }
      );
      // Tạo marker và popup cho các bạn bè (bff)
    } else {
      setStatus("Browser does not support geolocation.");
    }
  };

  const renderMapBff = () => {
    if (!mapInstanceRef.current) {
      console.error("Map instance is not initialized yet.");
      return;
    }
    mapBff.forEach((bff) => {
      if (bff.createBy.avatar) {
        const bffLatLng = L.latLng(
          bff.location.latitude,
          bff.location.longitude
        );

        const latitude = parseFloat(bff.location.latitude.toString());
        const longitude = parseFloat(bff.location.longitude.toString());

        if (isNaN(latitude) || isNaN(longitude)) {
          console.error("Invalid latitude or longitude:", latitude, longitude);
          return;
        }

        const { deltaLatitude, deltaLongitude } = deltaMapStatus(
          bff.location.latitude
        );

        const newBffLatLng =
          userLocation && bffLatLng.equals(userLocation)
            ? L.latLng(latitude + deltaLatitude, longitude + deltaLongitude)
            : L.latLng(latitude, longitude);

        console.log("check:", newBffLatLng);
        const bffIcon = createCustomIcon(bff.createBy.avatar);

        const bffMarker = L.marker(newBffLatLng, { icon: bffIcon }).addTo(
          mapInstanceRef.current!
        );

        const bffPopupContent = createPopupBffContent(bff.caption);
        const bffPopup = L.popup({
          className: "custom-leaflet-popup-bff",
          autoClose: false,
          closeOnClick: false
        })
          .setLatLng(newBffLatLng)
          .setContent(bffPopupContent);
        bffMarker.bindPopup(bffPopup).openPopup();

        // Tạo nameDiv cho bff
        const bffNameDiv = createNameDiv(
          bff.createBy.firstName + " " + bff.createBy.lastName
        );
        const bffNameMarker = L.marker(newBffLatLng, {
          icon: bffNameDiv
        }).addTo(mapInstanceRef.current!);
        bffNameMarker.addTo(mapInstanceRef.current!);
      }
    });
  };
  useEffect(() => {
    renderMap();
    if (userLocation) {
      renderMapBff();
    }
  });

  useEffect(() => {
    if (status !== "") {
      // Lập lại logic cập nhật popup khi status thay đổi
      if (mapInstanceRef.current) {
        mapInstanceRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker && layer.getPopup()) {
            const popup = layer.getPopup();
            if (popup?.options.className === "custom-leaflet-popup-bff") {
              return;
            }
            popup?.setContent(createPopupContent(status)); // Cập nhật nội dung của popup
          }
        });
      }
    }
  }, [status]);

  if (!isClient) {
    return (
      <div className="flex h-screen w-screen items-center justify-center background-light900_dark400">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div
          ref={mapContainerRef}
          style={{
            height: "91vh",
            width: "151vh",
            zIndex: 1,
            position: "relative"
          }}
        ></div>
      </div>

      {isClick && (
        <UpdateStatusModel
          isCreate={isCreate}
          status={status}
          statusId={statusId}
          setStatus={setStatus}
          setIsClick={setIsClick}
          setIsCreate={setIsCreate}
        />
      )}
    </>
  );
};

export default LeafletMap;
