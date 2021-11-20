import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { Select } from "@chakra-ui/select";
import { Container } from "@chakra-ui/layout";
import data from "@/data/data.json";
import { Box, Tag, Text } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { Parking } from "@/types/Parking";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Parking: NextPage<Props> = ({ parking }) => {
  const [selectedParking, setSelectedParking] = useState<Parking>(parking);
  const parkings = data.parkings;

  const suggestMessage = (now: Date, parking: Parking) => {
    const parkingOpenTime = new Date(parking.openAt);
    const parkingCloseTime = new Date(parking.closeAt);

    if (now.getTime() < parkingOpenTime.getTime()) {
      // 開場前
      return `開場前です。\n${parkingOpenTime.getHours()}時に開場します。`;
    } else if (now.getTime() > parkingCloseTime.getTime()) {
      // 閉場後
      return "閉場しました。";
    } else {
      return "開場中";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // 渡された key から駐車場を特定する
    const parking = parkings.filter((parking) => parking.key === e.target.value)[0];
    setSelectedParking(parking);
  };

  return (
    <Container h="100vh" bgColor="white">
      <Box pt={5} mb={5}>
        <Select color="gray.700" borderColor="gray.200" onChange={handleChange}>
          {parkings.map((parking) => (
            <option key={parking.key} value={parking.key}>
              {parking.name}
            </option>
          ))}
        </Select>
      </Box>
      <Box boxShadow="xs" py={3} px={5}>
        <Tag size="sm" bgColor="blue.300" fontWeight="bold" color="white" mb={1}>
          開場前
        </Tag>
        <Text color="black" fontSize="sm">
          {suggestMessage(new Date(), selectedParking)}
        </Text>
      </Box>
    </Container>
  );
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const parkings = data.parkings;

  // 渡された key から駐車場を特定する
  const parking = parkings.filter((parking) => parking.key === context.query.parking)[0];

  return {
    props: {
      parking: parking,
    },
  };
};

export default Parking;
