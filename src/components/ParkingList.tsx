import type { VFC } from "react";
import { Stack } from "@chakra-ui/react";
import data from "@/data/data.json";
import ParkingCard from "@/components/ParkingCard";

const ParkingList: VFC = () => {
  const parkings = data.parkings;

  return (
    <Stack spacing={2}>
      {parkings.map((parking) => (
        <ParkingCard key={parking.key} parking={parking} />
      ))}
    </Stack>
  );
};

export default ParkingList;
