import { Predict } from "@/types/Predict";

export type Parking = {
  key: string;
  name: string;
  officialName: string;
  address: string;
  carCapacity: number;
  distanceToStadium: number;
  timeToStadium: number;
  latitude: number;
  longitude: number;
  openAt: string;
  closeAt: string;
  status: string;
  predicts: Predict[];
  images: string[];
};
