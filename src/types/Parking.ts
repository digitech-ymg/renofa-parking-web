import { Predict } from "@/types/Predict";

export type Parking = {
  id: string;
  name: string;
  officialName: string;
  address: string;
  carCapacity: number;
  distanceToStadium: number;
  timeToStadium: number;
  latitude: number;
  longitude: number;
  routeUrl: string;
  hourToOpen: number;
  hourToClose: number;
  predicts: Predict[];
  minutesToPark: number;
  slopeToPark: number;
  images: string[];
};

export type ParkingInfo = {
  head: string;
  content: string;
};

const State = {
  Disable: "disable",
  BeforeOpen: "beforeOpen",
  Opened: "opened",
  Filled: "filled",
  AfterClosed: "afterClosed",
} as const;
type ParkingState = typeof State[keyof typeof State];

export type ParkingStatus = {
  state: ParkingState;
  percent: number;
  fillMinutes: number;
};
