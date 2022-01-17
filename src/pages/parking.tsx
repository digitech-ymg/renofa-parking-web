import type { NextPage } from "next";
import { Container } from "@chakra-ui/layout";
import data from "@/data/data.json";
import { Box, Stack, Image, Heading, Center } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption } from "@chakra-ui/react";
import { ChangeEvent, useState, useEffect } from "react";
import { Parking, ParkingInfo } from "@/types/Parking";
import { useRouter } from "next/router";

const Parking: NextPage = () => {
  const [selectedParking, setSelectedParking] = useState<Parking>();
  const [parkingInfos, setParkingInfos] = useState<ParkingInfo[]>();
  const router = useRouter();
  const parkings = data.parkings;

  useEffect(() => {
    const parking = parkings.filter((parking) => parking.key === router.query.parking)[0];
    setSelectedParking(parking);
  }, [parkings, router.query.parking]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // 渡された key から駐車場を特定する
    const parking = parkings.filter((parking) => parking.key === e.target.value)[0];
    setSelectedParking(parking);

    const parkingInfos = [
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
    setParkingInfos(parkingInfos);
  };

  if (selectedParking && parkingInfos) {
    return (
      <Box bgColor="white">
        <Container h="">
          <Center h="64px">
            <Heading as="h1" size="sm">
              {selectedParking.name}
            </Heading>
          </Center>
          <Table variant="unstyled">
            <Tbody>
              {parkingInfos.map((info, index) => (
                <Tr key={index}>
                  <Th width="50%" backgroundColor="gray.50" fontWeight="normal" border="1px">
                    {info.head}
                  </Th>
                  <Td width="50%" border="1px">
                    {info.content}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Stack my={5}>
            {selectedParking.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${selectedParking.name}の画像${index + 1}枚目`}
              />
            ))}
          </Stack>
        </Container>
      </Box>
    );
  } else {
    return <>loading...</>;
  }
};

export default Parking;
