import type { NextPage } from "next";
import { Select } from "@chakra-ui/select";
import { Container } from "@chakra-ui/layout";

type Parking = {
  name: string;
};

const parkings: Parking[] = [
  { name: "有料駐車場" },
  { name: "JA山口" },
  { name: "トラック協会" },
  { name: "河川敷" },
  { name: "パナソニック" },
];

const Parking: NextPage = () => {
  return (
    <Container h="100vh" bgColor="white">
      <Select color="gray.700" borderColor="gray.200">
        {parkings.map((parking) => (
          <option key={parking.name}>{parking.name}</option>
        ))}
      </Select>
    </Container>
  );
};

export default Parking;
