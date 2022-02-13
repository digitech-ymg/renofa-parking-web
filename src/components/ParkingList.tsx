import { Stack } from "@chakra-ui/react";
import ParkingCard from "@/components/ParkingCard";
import { parkingStatus } from "@/utils/parking";
import { Parking } from "@/types/Parking";
import { Game } from "@/types/Game";

type Props = {
  game: Game;
  parkings: Parking[];
};

const ParkingList = ({ game, parkings }: Props) => {
  const now = new Date();

  return (
    <Stack spacing={2}>
      {parkings &&
        parkings.map((parking) => (
          <ParkingCard
            key={parking.id}
            parking={parking}
            status={parkingStatus(now, game, parking)}
          />
        ))}
    </Stack>
  );
};

export default ParkingList;
