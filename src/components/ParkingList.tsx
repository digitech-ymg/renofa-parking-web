import type { VFC } from "react";
import { Stack } from "@chakra-ui/react";
import data from "@/data/data.json";
import ParkingCard from "@/components/ParkingCard";
import { parkingStatus } from "@/utils/parking";

const ParkingList: VFC = () => {
  const parkings = data.parkings;
  const now = new Date();
  const statuses = parkings.map((parking) => parkingStatus(now, parking));

  return (
    <Stack spacing={2}>
      {parkings.map((parking, idx) => (
        <ParkingCard key={parking.key} parking={parking} status={statuses[idx]} />
      ))}
    </Stack>
  );
};

export default ParkingList;
