import { useQuery } from "react-query";
import type { NextPage } from "next";
import { Container, Box, Link } from "@chakra-ui/react";
import SiteDescription from "@/components/SiteDescription";
import ParkingList from "@/components/ParkingList";
import RenofaBanner from "@/components/RenofaBanner";
import Game from "@/components/Game";

import { getMostRecentGame, getParkings } from "@/lib/firestore";
import ParkingColorSample from "@/components/ParkingColorSample";
import ParkingStatusSharer from "@/components/ParkingStatusSharer";

const Top: NextPage = () => {
  const {
    data: game,
    isLoading: isLoadingGame,
    error: errorGame,
  } = useQuery("mostRecentGame", getMostRecentGame, { staleTime: 50000, cacheTime: 50000 });
  const {
    data: parkings,
    isLoading: isLoadingParkings,
    error: errorParkings,
  } = useQuery("parkings", getParkings, { staleTime: 50000, cacheTime: 50000 });

  return (
    <Container bgColor="white">
      <Box mt={4} mb={4}>
        <Link href="/about">
          <SiteDescription />
        </Link>
      </Box>
      <Box bg="gray.100" p={4}>
        <Box experimental_spaceY={4}>
          {/* game */}
          {isLoadingGame && <p>loading...</p>}
          {game && <Game game={game} />}
          {errorGame && <p>試合情報の取得に失敗しました。</p>}

          <ParkingColorSample />

          {/* parkings */}
          {isLoadingParkings && <p>loading...</p>}
          {game && parkings && <ParkingList game={game} parkings={parkings} />}
          {errorParkings && <p>駐車場情報の取得に失敗しました。</p>}
        </Box>
      </Box>
      <Box mt={4} mb={4}>
        {/* TODO: DB取得データ挿入 */}
        <ParkingStatusSharer
          names={[
            "ほげほげ",
            "レノ丸",
            "やーまん",
            "ジョージ",
            "防府っ子",
            "維新太郎",
            "サッカー小僧",
            "ゆーべ",
            "シズル",
          ]}
        />
      </Box>
      <Box mt={4} mb={4}>
        <Link href="https://www.renofa.com/" isExternal>
          <RenofaBanner />
        </Link>
      </Box>
    </Container>
  );
};

export default Top;
