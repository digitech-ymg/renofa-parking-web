import type { NextPage } from "next";
import { getMostRecentGame, getParkings, getPosts } from "@/lib/firestore";
import useSWR from "swr";
import { useAuthContext } from "@/context/AuthContext";

import { Container, Box, Link } from "@chakra-ui/react";
import ParkingColorSample from "@/components/ParkingColorSample";
import ParkingStatusSharer from "@/components/ParkingStatusSharer";
import ParkingStateButton from "@/components/ParkingStatusButton";
import SiteDescription from "@/components/SiteDescription";
import Game from "@/components/Game";
import ParkingList from "@/components/ParkingList";
import RenofaBanner from "@/components/RenofaBanner";
import { useEffect, useState } from "react";

// 当日ほとんど変わらないものは1時間
const intervalHour = 60 * 60 * 1000;
// 1分間隔の周期で更新のものは50秒
const intervalLessMinute = 50 * 1000;

const Top: NextPage = () => {
  const { user } = useAuthContext();

  const { data: game, error: errorGame } = useSWR(
    user ? "mostRecentGame" : null,
    getMostRecentGame,
    {
      revalidateOnFocus: false,
      refreshInterval: intervalHour,
    }
  );
  const { data: parkings, error: errorParkings } = useSWR(user ? "parkings" : null, getParkings, {
    revalidateOnFocus: false,
    refreshInterval: intervalHour,
  });
  const { data: posts, error: errorPosts } = useSWR(
    user && game ? ["posts", game.id] : null,
    getPosts,
    {
      fallbackData: [],
      refreshInterval: intervalLessMinute,
    }
  );

  const now = new Date();
  // console.log("rendered at " + now);

  return (
    <Container bgColor="white">
      <Box mt={4} mb={4}>
        <Link href="/about">
          <SiteDescription />
        </Link>
      </Box>
      <Box mt={4} mb={4}>
        <Link href="/post">
          <ParkingStateButton />
        </Link>
      </Box>
      <Box bg="gray.100" p={4}>
        <Box experimental_spaceY={4}>
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
