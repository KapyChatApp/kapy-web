import { ShortUserResponseDTO } from "./user";

export interface AuthResponsDTO {
  _id: string;
  logTime: Date;
  deviceName: string;
  deviceType: string;
  brand?: string;
  modelName?: string;
  osName?: string;
  osVersion?: string;
  region: string;
  isSafe: boolean;
  isActive: boolean;
  user: ShortUserResponseDTO;
}

export interface DeviceInfo {
  _id: string;
  deviceName: string;
  deviceType: string;
  brand: string;
  modelName: string;
  osName: string;
  osVersion: string;
  region: string;
  isSafe: boolean;
  isActive: boolean;
  createAt: string;
}
