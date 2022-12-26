export type Game = {
  id: string;
  kind: string;
  section: string;
  startAt: Date;
  finishAt: Date;
  opponent: string;
  availableParkings: string[];
  soldOutParkings: string[];
  attendance: number;
  result: string;
  goalScore: number;
  goalAgainst: number;
};
