import { Parking } from "@/types/Parking";

export type Game = {
  kind: string;
  section: string;
  partner: string;
  thanksday: string;
  startAt: string;
  finishAt: string;
  parkings: Parking[];
  opponent: string;
};
