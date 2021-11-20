import type { NextPage } from "next";
import { Select } from "@chakra-ui/select";
import { Container } from "@chakra-ui/layout";
import data from "@/data/data.json";
import { Box } from "@chakra-ui/react";
import { ChangeEvent, useState, useEffect } from "react";
import { Parking } from "@/types/Parking";
import ParkingMessage from "@/components/ParkingMessage";
import { useRouter } from "next/router";

const Parking: NextPage = () => {
  const [selectedParking, setSelectedParking] = useState<Parking>();
  const router = useRouter();
  const parkings = data.parkings;

  useEffect(() => {
    const parking = parkings.filter((parking) => parking.key === router.query.parking)[0];
    setSelectedParking(parking);
  }, [router.query.parking]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // 渡された key から駐車場を特定する
    const parking = parkings.filter((parking) => parking.key === e.target.value)[0];
    setSelectedParking(parking);
  };

  if (selectedParking) {
    return (
      <Container h="100vh" bgColor="white">
        <Box pt={5} mb={5}>
          <Select
            color="gray.700"
            borderColor="gray.200"
            defaultValue={selectedParking.key}
            onChange={handleChange}
          >
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
  } else {
    return <>loading...</>;
  }
};

export default Parking;
