"use client";
import { DeviceInfo } from "@/lib/DTO/auth";
import { fetchAuthHistory } from "@/lib/services/auth/getHistoryLogin";
import { LeftSidbarSettingProps } from "@/types/settings";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const AuthHistory = () => {
  function shortenDeviceName(deviceName: string): string {
    // Tìm trình duyệt chính (Chrome, Edge, Safari, etc.)
    const browserMatch = deviceName.match(/(Chrome|Edg|Safari|Firefox|Opera)/i);
    const browser = browserMatch ? browserMatch[0] : "Unknown Browser";

    // Tìm hệ điều hành (Windows, macOS, Linux, etc.)
    const osMatch = deviceName.match(/Windows|Mac OS X|Linux|Android|iOS/i);
    const os = osMatch ? osMatch[0] : "Unknown OS";

    return `${browser} on ${os}`;
  }
  const [data, setData] = useState<DeviceInfo[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAuthHistory();
        setData(result);
      } catch (err) {
        alert("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-6 w-full h-[540px] justify-start items-start overflow-scroll scrollable">
        {data.map((item) => (
          <div className="flex flex-row background-light900_dark400 items-start justify-start p-2 rounded-lg w-full h-fit gap-4 border border-light-600">
            <div className="flex w-fit h-fit">
              <Icon
                icon={
                  item.deviceType === "DESKTOP"
                    ? "quill:desktop"
                    : item.deviceType === "PHONE"
                    ? "lineicons:phone"
                    : item.deviceType === "TABLET"
                    ? "hugeicons:tablet-01"
                    : "ic:round-devices-other"
                }
                width={40}
                height={40}
                className="text-dark100_light900"
              />
            </div>
            <div className="flex flex-col pl-2 gap-2 w-full h-fit">
              <div className="h-fit w-fit">
                <p className="text-dark100_light900 paragraph-semibold">
                  {item.deviceType === "DESKTOP"
                    ? shortenDeviceName(item.deviceName)
                    : item.deviceName}
                </p>
              </div>
              <div className="h-fit w-fit">
                <p
                  className={`${
                    item.isActive ? "text-primary-500" : "text-dark100_light900"
                  } body-regular`}
                >
                  {item.isActive ? "Active" : "Logged out"}
                </p>
              </div>
              <div className="h-fit w-fit">
                <p className="text-dark100_light900 body-regular">
                  {new Date(item.createAt).toLocaleDateString()}
                </p>
              </div>
              <div className="h-fit w-fit">
                <p className="text-dark100_light900 body-regular">
                  {item.osName} - {item.osVersion}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AuthHistory;
