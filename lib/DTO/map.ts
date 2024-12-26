import { LocationDTO } from "./location";
import { ShortUserResponseDTO } from "./user";

export interface CreateMapStatusDTO {
  caption: string;
  file?: File;
}

export interface EditMapStatusDTO {
  caption?: string;
  file?: File;
  keepOldContent?: boolean;
}

export interface FileResponseDTO {
  _id: string;
  fileName: string;
  url: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
  type: string;
}

export interface MapStatusResponseDTO {
  _id: string;
  caption: string;
  content: FileResponseDTO;
  location: LocationDTO;
  createAt: string;
  createBy: ShortUserResponseDTO;
}
