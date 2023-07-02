export type Game = {
  id: string;
  kind: string;
  section: string;
  startAt: Date;
  finishAt: Date;
  opponent: string;
  availableParkings: string[];
  soldOutParkings: string[];
  parkingOpenAdjustments?: ParkiparkingOpenAdjustment[];
  attendance: number;
  result: string;
  goalScore: number;
  goalAgainst: number;
};

export type ParkiparkingOpenAdjustment = {
  parkingId: string;
  minutes: number;
};
