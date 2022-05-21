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
  predictParkingStates: ParkingState[];
  adoptionParkingStates: ParkingState[];
  images: string[];
};

// 駐車場ステート（内部で移りゆく今の「状態」）
export type ParkingState = {
  minutes: number;
  ratio: number;
};

export type ParkingInfo = {
  head: string;
  content: string;
};

const Status = {
  Disable: "disable",
  BeforeOpen: "beforeOpen",
  Opened: "opened",
  Filled: "filled",
  AfterClosed: "afterClosed",
  SoldOut: "soldOut",
} as const;
type Status = typeof Status[keyof typeof Status];

// 駐車場ステータス（外部向けに現時点の「状態」）
export type ParkingStatus = {
  state: Status;
  percent: number;
  fillMinutes: number;
};
