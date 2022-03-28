import { Stack } from "@chakra-ui/react";
import ParkingCard from "@/components/ParkingCard";
import { parkingStatus } from "@/utils/parking";
import { Parking } from "@/types/Parking";
import { Game } from "@/types/Game";
import { Post } from "@/types/Post";

type Props = {
  game: Game;
  parkings: Parking[];
  posts: Post[];
};

const ParkingList = ({ game, parkings, posts }: Props) => {
  const now = new Date();

  return (
    <Stack spacing={2}>
      {parkings &&
        parkings.map((parking) => (
          <ParkingCard
            key={parking.id}
            parking={parking}
            status={parkingStatus(
              now,
              game,
              parking,
              posts.filter((post) => post.parkingId == parking.id)
            )}
          />
        ))}
    </Stack>
  );
};

export default ParkingList;
