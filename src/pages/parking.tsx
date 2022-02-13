import type { NextPage } from "next";
import { useQuery } from "react-query";
import { Container } from "@chakra-ui/layout";
import { Box, Stack, Image, Heading, Center } from "@chakra-ui/react";
import { Table, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Iframe from "react-iframe";
import { Parking, ParkingInfo } from "@/types/Parking";
import { useRouter } from "next/router";
import { getParkings } from "@/lib/firestore";

const Parking: NextPage = () => {
  const [parking, setParking] = useState<Parking>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery("parkings", getParkings, {
    onSuccess: (data) => {
      const selectedParking = data.filter((parking) => parking.id === router.query.parking)[0];
      setParking(selectedParking);
    },
  });

  const renderParkingTable = (parking: Parking) => {
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
        content: `${parking.carCapacity}台`,
      },
      {
        head: "スタジアムまでの距離",
        content: `${parking.distanceToStadium}m`,
      },
      {
        head: "スタジアムまでの時間",
        content: `${parking.timeToStadium}分`,
      },
      {
        head: "開場時間",
        content: `${parking.hourToOpen}時間`,
      },
      {
        head: "閉場時間",
        content: `${parking.hourToClose}時間`,
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

  if (isLoading) {
    return <>loading...</>;
  }

  if (error) {
    return <>データの取得に失敗しました。</>;
  }

  return (
    <Box bgColor="white">
      <Container h="">
        {parking && (
          <>
            <Center h="64px">
              <Heading as="h1" size="sm">
                {parking.name}
              </Heading>
            </Center>
            {renderParkingTable(parking)}
            <Box my={5}>
              <Iframe url={parking.routeUrl} width="100%" height="360" />
            </Box>
            <Stack my={5}>
              {parking.images.map((image, index) => (
                <Image key={index} src={image} alt={`${parking.name}の画像${index + 1}枚目`} />
              ))}
            </Stack>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Parking;
