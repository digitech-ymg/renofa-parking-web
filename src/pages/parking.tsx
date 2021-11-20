import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { Select } from "@chakra-ui/select";
import { Container } from "@chakra-ui/layout";
import data from "@/data/data.json";
import { Box } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { Parking } from "@/types/Parking";
import ParkingMessage from "@/components/ParkingMessage";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Parking: NextPage<Props> = ({ parking }) => {
  const [selectedParking, setSelectedParking] = useState<Parking>(parking);
  const parkings = data.parkings;

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
      <ParkingMessage parking={selectedParking} />
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
