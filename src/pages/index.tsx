import type { NextPage } from "next";
import { getMostRecentGame, getParkings, getPosts, isOffSeason } from "@/lib/firestore";
import useSWR from "swr";

import { Container, Box, Link } from "@chakra-ui/react";
import ParkingColorSample from "@/components/ParkingColorSample";
import ParkingStatusSharer from "@/components/ParkingStatusSharer";
import ParkingStateButton from "@/components/ParkingStatusButton";
import SiteDescription from "@/components/SiteDescription";
import GoMyPage from "@/components/GoMyPage";
import Game from "@/components/Game";
import ParkingList from "@/components/ParkingList";
import RenofaBanner from "@/components/RenofaBanner";
import SummaryContent from "@/components/SummaryContent";

// 当日ほとんど変わらないものは1時間
const intervalHour = 60 * 60 * 1000;
// 1分間隔の周期で更新のものは50秒
const intervalLessMinute = 50 * 1000;

const Top: NextPage = () => {
  const { data: game, error: errorGame } = useSWR("mostRecentGame", getMostRecentGame, {
    revalidateOnFocus: false,
    refreshInterval: intervalHour,
  });
  const { data: parkings, error: errorParkings } = useSWR("parkings", getParkings, {
    revalidateOnFocus: false,
    refreshInterval: intervalHour,
  });
  const { data: posts, error: errorPosts } = useSWR(game ? ["posts", game.id] : null, getPosts, {
    fallbackData: [],
    refreshInterval: intervalLessMinute,
  });
  const { data: offSeason, error: errorOffSeason } = useSWR("offSeason", isOffSeason, {
    revalidateOnFocus: false,
    refreshInterval: intervalHour,
  });

  const now = new Date();

  return (
    <Container bgColor="white">
      <Box mt={4} mb={4}>
        <Link href="/about">
          <SiteDescription />
        </Link>
      </Box>
      {/* TODO: 直近の試合が一定期間内ではない時に表示する */}
      {/* <Box mt={4} mb={4}>
        <Link href="/mypage">
          <GoMyPage />
        </Link>
      </Box> */}
      <Box mt={4} mb={4}>
        <Link href="/post">
          <ParkingStateButton />
        </Link>
      </Box>
      <Box bg="gray.100" p={4}>
        <Box experimental_spaceY={4}>
          {/* TODO: 直近の試合が一定期間内ではない時に表示する */}
          {/* <SummaryContent /> */}

          {/* game */}
          {!game && !errorGame && <p>loading...</p>}
          {game && <Game game={game} />}
          {errorGame && <p>試合情報の取得に失敗しました。</p>}

          <ParkingColorSample />
          {/* parkings */}
          {!parkings && !errorParkings && <p>loading...</p>}
          {game && parkings && posts && (
            <ParkingList now={now} game={game} parkings={parkings} posts={posts} />
          )}
          {errorParkings && <p>駐車場情報の取得に失敗しました。</p>}
        </Box>
      </Box>
      <Box mt={4} mb={4}>
        {posts && <ParkingStatusSharer names={posts?.map((post) => post.nickname)} />}
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
