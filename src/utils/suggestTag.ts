import type { Parking } from "@/types/Parking";

type Tag = {
  label: string;
  color: string;
};

export const suggestTag = (now: Date, parking: Parking): Tag => {
  let tag: Tag;
  const parkingOpenTime = new Date(parking.openAt);
  const parkingCloseTime = new Date(parking.closeAt);

  if (now.getTime() < parkingOpenTime.getTime()) {
    tag = { label: "開場前", color: "blue.300" };
  } else if (now.getTime() > parkingCloseTime.getTime()) {
    tag = { label: "閉場", color: "red.500" };
  } else {
    if (parking.status === "full") {
      tag = { label: "満車", color: "red00" };
    } else {
      tag = { label: "空きあり", color: "teal.500" };
    }
  }

  return tag;
};
