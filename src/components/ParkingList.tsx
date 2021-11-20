import type { VFC } from "react";
import {
  Stack,
  StackDivider,
  useColorModeValue,
  Heading,
  Center,
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import data from "@/data/data.json";

const parkings = data.parkings;
console.info(parkings);

const ParkingList: VFC = () => {
  return (
    <Stack
      spacing={4}
      divider={<StackDivider borderColor={useColorModeValue("gray.100", "gray.700")} />}
    >
      {parkings.map((parking) => (
        <Flex key="parking.key">
          <Heading as="h5" size="sm" ml="3">
            {parking.name}
          </Heading>
          <Spacer />
          <ChevronRightIcon mr="3" />
        </Flex>
      ))}
    </Stack>
  );
};

export default ParkingList;
