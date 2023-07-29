import type { NextPage } from "next";
import { Container } from "@chakra-ui/layout";
import { Box, Stack, Image, Heading, Center } from "@chakra-ui/react";
import { Table, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { Parking, ParkingInfo } from "@/types/Parking";
import { useRouter } from "next/router";
import { getMostRecentGame, getParkings } from "@/lib/firestore";
import { useAuthContext } from "@/context/AuthContext";
import useSWR from "swr";

// 当日ほとんど変わらないものは1時間
const intervalHour = 60 * 60 * 1000;

type ParkingContent = {
  parking: Parking;
  adjustText: string;
};

const Parking: NextPage = () => {
  const { user } = useAuthContext();
  const [parkingContent, setParkingContent] = useState<ParkingContent | undefined>(undefined);
  const router = useRouter();

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

  useEffect(() => {
    if (game && parkings) {
      const selectedParking = parkings.find((p) => p.id === router.query.parking);
      if (!selectedParking) {
        return;
      }

      let adjustText = "";
      if (game.parkingOpenAdjustments) {
        const adjust = game.parkingOpenAdjustments.find(
          (adjust) => adjust.parkingId === selectedParking.id
        );
        if (adjust && adjust.minutes !== 0) {
          adjustText = `（当日/直近の試合では${
            adjust.minutes > 0 ? `${adjust.minutes} 分遅れて` : `${-adjust.minutes} 分早く`
          }開場します）`;
        }
      }
      setParkingContent({
        parking: selectedParking,
        adjustText: adjustText,
      });
    }
  }, [game, parkings, router.query.parking]);

  const renderParkingTable = (parking: Parking, adjustText: string) => {
    const infos: ParkingInfo[] = [
      {
        head: "正式名称",
        content: parking.officialName,
      },
      {
        head: "住所",
        content: parking.address,
      },
      {
        head: "収容台数",
        content: `${parking.carCapacity} 台`,
      },
      {
        head: "スタジアムまでの距離",
        content: `${parking.distanceToStadium} m`,
      },
      {
        head: "スタジアムまでの時間",
        content: `${parking.timeToStadium} 分`,
      },
      {
        head: "開場時間",
        content: `試合開始時刻の ${parking.hourToOpen}時間前 ${adjustText}`,
      },
      {
        head: "閉場時間",
        content: `試合終了時刻の ${parking.hourToClose}時間後`,
      },
    ];

    return (
      <Table variant="unstyled">
        <Tbody>
          {infos.map((info, index) => (
            <Tr key={index}>
              <Th
                width="50%"
                backgroundColor="gray.50"
                fontWeight="normal"
                fontSize="md"
                border="1px"
              >
                {info.head}
              </Th>
              <Td width="50%" border="1px">
                {info.content}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  return (
    <Box bgColor="white">
      <Container h="">
        {parkingContent && (
          <>
            <Center h="64px">
              <Image width="7%" marginRight={2} objectFit="cover" src="/reno_02.png" alt="レノ丸" />
              <Heading as="h1" size="sm">
                {parkingContent.parking.name}
              </Heading>
            </Center>
            {renderParkingTable(parkingContent.parking, parkingContent.adjustText)}
            <Box my={5}>
              <Iframe url={parkingContent.parking.routeUrl} width="100%" height="360" />
            </Box>
            <Stack my={5}>
              {parkingContent.parking.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${parkingContent.parking.name}の画像${index + 1}枚目`}
                />
              ))}
            </Stack>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Parking;
