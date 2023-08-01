import type { NextPage } from "next";
import { getMostRecentGame, getParkings, getPosts, getShowableInformations } from "@/lib/firestore";
import { isOffSeason } from "@/utils/game";
import useSWR from "swr";

import { Container, Box, Link, Heading, VStack, UnorderedList, ListItem } from "@chakra-ui/react";
import ParkingColorSample from "@/components/ParkingColorSample";
import ParkingStatusSharer from "@/components/ParkingStatusSharer";
import ParkingStateButton from "@/components/ParkingStatusButton";
import SiteDescription from "@/components/SiteDescription";
import Game from "@/components/Game";
import ParkingList from "@/components/ParkingList";
import RenofaBanner from "@/components/RenofaBanner";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

// 当日ほとんど変わらないものは1時間
const intervalHour = 60 * 60 * 1000;
// 1分間隔の周期で更新のものは50秒
const intervalLessMinute = 50 * 1000;
// お知らせの更新は60秒
const intervalMinute = 60 * 1000;

const Top: NextPage = () => {
  const { user } = useAuthContext();
  const now = new Date();

  const { data: infos, error: errorInfos } = useSWR(
    user ? "getShowableInformations" : null,
    getShowableInformations,
    {
      revalidateOnFocus: false,
      refreshInterval: intervalMinute,
    }
  );

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
  // オフシーズン変数Props（確定前はundefinedで何も表示させない）
  const [offSeason, setOffSeason] = useState<boolean | undefined>(undefined);

  // game更新時にオフシーズン変数更新
  useEffect(() => {
    if (game) {
      // オフ判定
      setOffSeason(isOffSeason(new Date(), game.startAt));
    } else {
      // 試合がない＝オフ
      setOffSeason(false);
    }
  }, [game]);

  return (
    <Container bgColor="white">
      <Box mt={4} mb={4}>
        <Link href="/about">
          <SiteDescription />
        </Link>
      </Box>
      {infos && (
        <Box mt={4} mb={4} backgroundColor="#FFEEEE" p={4}>
          <VStack align="center" spacing={4}>
            <Heading as="h2" mx="auto" size="sm" color="#FF0000">
              運営からのお知らせ
            </Heading>
            {infos.length > 0 ? (
              <UnorderedList spacing={2}>
                {infos.map((info, idx) => (
                  <ListItem ml={4} key={idx}>
                    {info.text}
                  </ListItem>
                ))}
              </UnorderedList>
            ) : (
              <p>ありません</p>
            )}
          </VStack>
        </Box>
      )}
      {offSeason && (
        <>
          <Box mt={4} mb={4}>
            次の試合はまだ未定です
          </Box>
        </>
      )}
      {offSeason === false && (
        <>
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
              {errorGame && <p>次の試合はまだ未定です。</p>}
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
        </>
      )}
      <Box mt={4} mb={4}>
        <Link href="https://www.renofa.com/" isExternal>
          <RenofaBanner />
        </Link>
      </Box>
    </Container>
  );
};

export default Top;
